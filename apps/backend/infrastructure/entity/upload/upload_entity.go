package upload

type Entity struct {
	ID       string `gorm:"type:uuid;default:gen_random_uuid()"`
	Filename string
	Status   string
	TusID    string
}

func (Entity) TableName() string {
	return "uploads"
}
