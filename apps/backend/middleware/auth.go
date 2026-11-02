package middleware

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"videoStreaming/config"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
)

const (
	ContextUserIDKey    = "userID"
	ContextSessionIDKey = "sessionID"
	ContextTokenIDKey   = "tokenID"
	ContextScopeKey     = "scope"
	ErrorResponseKey    = "error"
)

type TokenClaims struct {
	jwt.RegisteredClaims

	SessionID string `json:"sid,omitzero"`
	Scope     string `json:"scope,omitzero"`
}

// AccessTokenClaims is kept as alias for compatibility.
type AccessTokenClaims = TokenClaims

var (
	ErrMissingAuthHeader = errors.New("missing or invalid authorization header")
	ErrInvalidToken      = errors.New("invalid or expired token")
	ErrTokenRevoked      = errors.New("token is revoked or not found in redis")
	ErrForbidden         = errors.New("forbidden: insufficient token scope")
)

// RedisClient is the interface covering Redis commands used by auth middleware.
type RedisClient interface {
	Exists(ctx context.Context, keys ...string) *redis.IntCmd
}

func parseBearerTokenWithSecret(ctx *gin.Context, secret string) (*TokenClaims, error) {
	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return nil, ErrMissingAuthHeader
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	tokenString = strings.TrimSpace(tokenString)
	if tokenString == "" {
		return nil, ErrMissingAuthHeader
	}

	claims := &TokenClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(secret), nil
	})

	if err != nil || !token.Valid {
		return nil, ErrInvalidToken
	}

	return claims, nil
}

// BFFRequired creates a Gin middleware that verifies the request comes from BFF (BFF JWT).
// It verifies the JWT signature using BFFSecret and checks that scope == "bff" or scope == "user".
func BFFRequired(jwtCfg config.JWTConfig) gin.HandlerFunc {
	secret := jwtCfg.BFFSecret
	if secret == "" {
		secret = jwtCfg.Secret
	}
	return func(ctx *gin.Context) {
		claims, err := parseBearerTokenWithSecret(ctx, secret)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{ErrorResponseKey: err.Error()})
			return
		}

		if claims.Scope != "bff" && claims.Scope != "user" && claims.Subject == "" {
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{ErrorResponseKey: ErrForbidden.Error()})
			return
		}

		ctx.Set(ContextScopeKey, claims.Scope)
		if claims.ID != "" {
			ctx.Set(ContextTokenIDKey, claims.ID)
		}
		ctx.Next()
	}
}

// UserRequired creates a Gin middleware that verifies the user authentication token (USER JWT).
// It verifies JWT signature using UserSecret, user claims (sub/sid/jti), and token presence in Redis (token:access:<jti>).
func UserRequired(jwtCfg config.JWTConfig, redisClient RedisClient) gin.HandlerFunc {
	secret := jwtCfg.UserSecret
	if secret == "" {
		secret = jwtCfg.Secret
	}
	return func(ctx *gin.Context) {
		claims, err := parseBearerTokenWithSecret(ctx, secret)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{ErrorResponseKey: err.Error()})
			return
		}

		tokenID := claims.ID
		if tokenID == "" || claims.Subject == "" {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{ErrorResponseKey: ErrInvalidToken.Error()})
			return
		}

		// Redis check: token:access:<jti>
		redisKey := fmt.Sprintf("token:access:%s", tokenID)
		exists, err := redisClient.Exists(ctx.Request.Context(), redisKey).Result()
		if err != nil || exists == 0 {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{ErrorResponseKey: ErrTokenRevoked.Error()})
			return
		}

		ctx.Set(ContextUserIDKey, claims.Subject)
		ctx.Set(ContextSessionIDKey, claims.SessionID)
		ctx.Set(ContextTokenIDKey, tokenID)
		ctx.Set(ContextScopeKey, claims.Scope)

		ctx.Next()
	}
}

// AuthRequired is an alias/standard handler for user authentication (UserRequired).
func AuthRequired(jwtCfg config.JWTConfig, redisClient RedisClient) gin.HandlerFunc {
	return UserRequired(jwtCfg, redisClient)
}
