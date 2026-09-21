package upload

type Entity struct {
	ID       string `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Filename string `gorm:"type:text;not null"`
	Status   string `gorm:"type:text;not null"`
	TusID    string `gorm:"type:text;not null;uniqueIndex:uploads_tus_id_key"`
}

func (Entity) TableName() string {
	return "uploads"
}
