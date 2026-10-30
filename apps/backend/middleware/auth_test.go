package middleware_test

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"videoStreaming/config"
	"videoStreaming/middleware"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type mockRedisClient struct {
	existsMap map[string]int64
}

func (m *mockRedisClient) Exists(ctx context.Context, keys ...string) *redis.IntCmd {
	cmd := redis.NewIntCmd(ctx)
	var count int64
	for _, k := range keys {
		if val, ok := m.existsMap[k]; ok {
			count += val
		}
	}
	cmd.SetVal(count)
	return cmd
}

func createTestUserToken(t *testing.T, secret string, userID, sessionID, jti string, exp time.Duration) string {
	t.Helper()
	claims := middleware.TokenClaims{
		SessionID: sessionID,
		Scope:     "user",
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			ID:        jti,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(exp)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString([]byte(secret))
	require.NoError(t, err)
	return tokenStr
}

func createTestBffToken(t *testing.T, secret string, jti string, exp time.Duration) string {
	t.Helper()
	claims := middleware.TokenClaims{
		Scope: "bff",
		RegisteredClaims: jwt.RegisteredClaims{
			ID:        jti,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(exp)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString([]byte(secret))
	require.NoError(t, err)
	return tokenStr
}

func setupAuthTestEnv(t *testing.T) (*gin.Engine, *mockRedisClient, string) {
	t.Helper()
	gin.SetMode(gin.TestMode)

	mockRedis := &mockRedisClient{
		existsMap: make(map[string]int64),
	}
	userSecret := "test-user-secret-key-12345"
	jwtCfg := config.JWTConfig{
		UserSecret: userSecret,
		BFFSecret:  "test-bff-secret-key-12345",
	}

	r := gin.New()
	r.Use(middleware.UserRequired(jwtCfg, mockRedis))
	r.GET("/protected", func(c *gin.Context) {
		userID, _ := c.Get(middleware.ContextUserIDKey)
		sessionID, _ := c.Get(middleware.ContextSessionIDKey)
		tokenID, _ := c.Get(middleware.ContextTokenIDKey)
		scope, _ := c.Get(middleware.ContextScopeKey)
		c.JSON(http.StatusOK, gin.H{
			"userID":    userID,
			"sessionID": sessionID,
			"tokenID":   tokenID,
			"scope":     scope,
		})
	})

	return r, mockRedis, userSecret
}

func setupBffTestEnv(t *testing.T) (*gin.Engine, string) {
	t.Helper()
	gin.SetMode(gin.TestMode)

	bffSecret := "test-bff-secret-key-12345"
	jwtCfg := config.JWTConfig{
		BFFSecret:  bffSecret,
		UserSecret: "test-user-secret-key-12345",
	}

	r := gin.New()
	r.Use(middleware.BFFRequired(jwtCfg))
	r.GET("/bff-only", func(c *gin.Context) {
		tokenID, _ := c.Get(middleware.ContextTokenIDKey)
		scope, _ := c.Get(middleware.ContextScopeKey)
		c.JSON(http.StatusOK, gin.H{
			"tokenID": tokenID,
			"scope":   scope,
		})
	})

	return r, bffSecret
}

func TestUserRequired_Success(t *testing.T) {
	r, mockRedis, secret := setupAuthTestEnv(t)

	userID := "usr_123"
	sessionID := "sid_abc"
	tokenID := "jti_xyz"

	tokenStr := createTestUserToken(t, secret, userID, sessionID, tokenID, time.Minute)
	mockRedis.existsMap["token:access:"+tokenID] = 1

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"userID":"usr_123"`)
	assert.Contains(t, w.Body.String(), `"sessionID":"sid_abc"`)
	assert.Contains(t, w.Body.String(), `"tokenID":"jti_xyz"`)
	assert.Contains(t, w.Body.String(), `"scope":"user"`)
}

func TestUserRequired_MissingOrInvalidHeader(t *testing.T) {
	r, _, _ := setupAuthTestEnv(t)

	cases := []struct {
		name   string
		header string
	}{
		{name: "missing header", header: ""},
		{name: "not bearer", header: "Basic 12345"},
		{name: "empty bearer", header: "Bearer "},
		{name: "only spaces", header: "Bearer    "},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/protected", nil)
			if tc.header != "" {
				req.Header.Set("Authorization", tc.header)
			}
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			assert.Equal(t, http.StatusUnauthorized, w.Code)
			assert.Contains(t, w.Body.String(), middleware.ErrMissingAuthHeader.Error())
		})
	}
}

func TestUserRequired_InvalidJWT(t *testing.T) {
	r, _, secret := setupAuthTestEnv(t)

	cases := []struct {
		name  string
		token string
	}{
		{name: "malformed token", token: "invalid.jwt.string"},
		{name: "signed with wrong secret", token: createTestUserToken(t, "wrong-secret", "u", "s", "t", time.Minute)},
		{
			name:  "signed with bff secret instead of user secret",
			token: createTestUserToken(t, "test-bff-secret-key-12345", "u", "s", "t", time.Minute),
		},
		{name: "expired token", token: createTestUserToken(t, secret, "u", "s", "t", -time.Minute)},
		{
			name: "unsigned token with none algorithm",
			token: func() string {
				claims := middleware.TokenClaims{
					RegisteredClaims: jwt.RegisteredClaims{
						Subject: "u",
						ID:      "t",
					},
				}
				token := jwt.NewWithClaims(jwt.SigningMethodNone, claims)
				tokenStr, _ := token.SignedString(jwt.UnsafeAllowNoneSignatureType)
				return tokenStr
			}(),
		},
		{
			name:  "missing token id (jti)",
			token: createTestUserToken(t, secret, "usr_123", "sid_123", "", time.Minute),
		},
		{
			name:  "missing subject (sub)",
			token: createTestUserToken(t, secret, "", "sid_123", "jti_123", time.Minute),
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/protected", nil)
			req.Header.Set("Authorization", "Bearer "+tc.token)
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			assert.Equal(t, http.StatusUnauthorized, w.Code)
			assert.Contains(t, w.Body.String(), middleware.ErrInvalidToken.Error())
		})
	}
}

func TestUserRequired_NotInRedis(t *testing.T) {
	r, _, secret := setupAuthTestEnv(t)

	tokenStr := createTestUserToken(t, secret, "usr_123", "sid_abc", "jti_not_in_redis", time.Minute)

	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), middleware.ErrTokenRevoked.Error())
}

func TestBFFRequired_Success(t *testing.T) {
	r, secret := setupBffTestEnv(t)

	tokenID := "bff_jti_123"
	tokenStr := createTestBffToken(t, secret, tokenID, time.Minute)

	req := httptest.NewRequest(http.MethodGet, "/bff-only", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Contains(t, w.Body.String(), `"tokenID":"bff_jti_123"`)
	assert.Contains(t, w.Body.String(), `"scope":"bff"`)
}

func TestBFFRequired_InvalidScope(t *testing.T) {
	r, secret := setupBffTestEnv(t)

	cases := []struct {
		name       string
		token      string
		wantStatus int
	}{
		{
			name: "scope other",
			token: func() string {
				claims := middleware.TokenClaims{
					Scope: "invalid-scope",
					RegisteredClaims: jwt.RegisteredClaims{
						ID:        "jti_bad",
						ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute)),
					},
				}
				token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
				tokenStr, err := token.SignedString([]byte(secret))
				require.NoError(t, err)
				return tokenStr
			}(),
			wantStatus: http.StatusForbidden,
		},
		{
			name:       "signed with user secret instead of bff secret",
			token:      createTestBffToken(t, "test-user-secret-key-12345", "bff_123", time.Minute),
			wantStatus: http.StatusUnauthorized,
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/bff-only", nil)
			req.Header.Set("Authorization", "Bearer "+tc.token)
			w := httptest.NewRecorder()

			r.ServeHTTP(w, req)

			assert.Equal(t, tc.wantStatus, w.Code)
		})
	}
}

func TestAuthRequired_And_SecretFallback(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockRedis := &mockRedisClient{
		existsMap: map[string]int64{
			"token:access:jti_fallback": 1,
		},
	}
	jwtCfg := config.JWTConfig{
		Secret:     "fallback-secret-12345",
		UserSecret: "",
		BFFSecret:  "",
	}

	r := gin.New()
	r.Use(middleware.AuthRequired(jwtCfg, mockRedis))
	r.GET("/auth-endpoint", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	tokenStr := createTestUserToken(
		t,
		"fallback-secret-12345",
		"usr_fallback",
		"sid_fallback",
		"jti_fallback",
		time.Minute,
	)

	req := httptest.NewRequest(http.MethodGet, "/auth-endpoint", nil)
	req.Header.Set("Authorization", "Bearer "+tokenStr)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	// Also test BFFRequired secret fallback
	rBff := gin.New()
	rBff.Use(middleware.BFFRequired(jwtCfg))
	rBff.GET("/bff-endpoint", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	bffTokenStr := createTestBffToken(t, "fallback-secret-12345", "bff_fallback_jti", time.Minute)
	reqBff := httptest.NewRequest(http.MethodGet, "/bff-endpoint", nil)
	reqBff.Header.Set("Authorization", "Bearer "+bffTokenStr)
	wBff := httptest.NewRecorder()
	rBff.ServeHTTP(wBff, reqBff)

	assert.Equal(t, http.StatusOK, wBff.Code)
}
