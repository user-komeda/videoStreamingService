package auth_test

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	authDto "videoStreaming/application/dto/auth"
	appErrors "videoStreaming/application/errors"
	authController "videoStreaming/presentation/controller/auth"

	"github.com/gin-gonic/gin"
)

type mockSignUpUC struct {
	invokeFn func(ctx context.Context, input authDto.SignUpInput) (*authDto.ResultDto, error)
}

func (m *mockSignUpUC) Invoke(ctx context.Context, input authDto.SignUpInput) (*authDto.ResultDto, error) {
	if m.invokeFn != nil {
		return m.invokeFn(ctx, input)
	}
	return &authDto.ResultDto{
		UserID: "usr_123",
	}, nil
}

type mockSignInUC struct {
	invokeFn func(ctx context.Context, input authDto.SignInInput) (*authDto.ResultDto, error)
}

func (m *mockSignInUC) Invoke(ctx context.Context, input authDto.SignInInput) (*authDto.ResultDto, error) {
	if m.invokeFn != nil {
		return m.invokeFn(ctx, input)
	}
	return &authDto.ResultDto{
		UserID: "usr_123",
	}, nil
}

func TestController_SignUp_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	ctrl := authController.NewController(&mockSignUpUC{}, &mockSignInUC{})

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	body := `{"email":"test@example.com","password":"password123"}`
	req, _ := http.NewRequestWithContext(
		t.Context(),
		http.MethodPost,
		"/auth/signup",
		strings.NewReader(body),
	)
	req.Header.Set("Content-Type", "application/json")
	c.Request = req

	ctrl.SignUp(c)

	if w.Code != http.StatusCreated {
		t.Errorf("expected 201 Created, got %d", w.Code)
	}
}

func TestController_SignUp_InvalidBody(t *testing.T) {
	gin.SetMode(gin.TestMode)
	ctrl := authController.NewController(&mockSignUpUC{}, &mockSignInUC{})

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	body := `{"email":"invalid-email","password":"123"}`
	req, _ := http.NewRequestWithContext(
		t.Context(),
		http.MethodPost,
		"/auth/signup",
		strings.NewReader(body),
	)
	req.Header.Set("Content-Type", "application/json")
	c.Request = req

	ctrl.SignUp(c)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400 Bad Request, got %d", w.Code)
	}
}

func TestController_SignUp_UseCaseError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockUC := &mockSignUpUC{
		invokeFn: func(_ context.Context, _ authDto.SignUpInput) (*authDto.ResultDto, error) {
			return nil, appErrors.NewAppError(
				appErrors.CodeConflict,
				"email already in use",
				errors.New("duplicate key"),
			)
		},
	}
	ctrl := authController.NewController(mockUC, &mockSignInUC{})

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	body := `{"email":"existing@example.com","password":"password123"}`
	req, _ := http.NewRequestWithContext(
		t.Context(),
		http.MethodPost,
		"/auth/signup",
		strings.NewReader(body),
	)
	req.Header.Set("Content-Type", "application/json")
	c.Request = req

	ctrl.SignUp(c)

	if w.Code != http.StatusConflict {
		t.Errorf("expected 409 Conflict, got %d", w.Code)
	}
}

func TestController_SignIn_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)
	ctrl := authController.NewController(&mockSignUpUC{}, &mockSignInUC{})

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	body := `{"email":"test@example.com","password":"password123"}`
	req, _ := http.NewRequestWithContext(
		t.Context(),
		http.MethodPost,
		"/auth/signin",
		strings.NewReader(body),
	)
	req.Header.Set("Content-Type", "application/json")
	c.Request = req

	ctrl.SignIn(c)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200 OK, got %d", w.Code)
	}
}

func TestController_SignIn_InvalidBody(t *testing.T) {
	gin.SetMode(gin.TestMode)
	ctrl := authController.NewController(&mockSignUpUC{}, &mockSignInUC{})

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	body := `{"email":"not-an-email","password":""}`
	req, _ := http.NewRequestWithContext(
		t.Context(),
		http.MethodPost,
		"/auth/signin",
		strings.NewReader(body),
	)
	req.Header.Set("Content-Type", "application/json")
	c.Request = req

	ctrl.SignIn(c)

	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400 Bad Request, got %d", w.Code)
	}
}

func TestController_SignIn_Unauthorized(t *testing.T) {
	gin.SetMode(gin.TestMode)
	mockUC := &mockSignInUC{
		invokeFn: func(_ context.Context, _ authDto.SignInInput) (*authDto.ResultDto, error) {
			return nil, appErrors.NewAppError(
				appErrors.CodeUnauthorized,
				"invalid credentials",
				errors.New("password mismatch"),
			)
		},
	}
	ctrl := authController.NewController(&mockSignUpUC{}, mockUC)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	body := `{"email":"test@example.com","password":"wrongpassword"}`
	req, _ := http.NewRequestWithContext(
		t.Context(),
		http.MethodPost,
		"/auth/signin",
		strings.NewReader(body),
	)
	req.Header.Set("Content-Type", "application/json")
	c.Request = req

	ctrl.SignIn(c)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 Unauthorized, got %d", w.Code)
	}
}
