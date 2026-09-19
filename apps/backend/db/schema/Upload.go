package schema

type Upload struct {
	ID       string `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	TusID    string `gorm:"type:text;not null;uniqueIndex:uploads_tus_id_key"`
	Filename string `gorm:"type:text;not null"`
	Status   string `gorm:"type:text;not null"`
}
