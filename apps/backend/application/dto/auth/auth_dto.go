package auth

type SignUpInput struct {
	Email    string
	Password string
}

type SignInInput struct {
	Email    string
	Password string
}

type ResultDto struct {
	UserID string
}
