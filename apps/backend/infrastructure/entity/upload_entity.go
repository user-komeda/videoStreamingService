package entity

type UploadEntity struct {
	ID       string `gorm:"type:uuid;default:gen_random_uuid()"`
	Filename string
	Status   string
	TusID    string
}

func (UploadEntity) TableName() string {
	return "uploads"
}
