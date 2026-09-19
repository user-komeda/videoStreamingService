package schema

type Video struct {
	ID          string `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	OwnerID     string `gorm:"type:uuid;not null;index:idx_videos_owner_id"`
	Title       string `gorm:"type:text;not null"`
	Description string `gorm:"type:text;not null;default:''"`
	Visibility  string `gorm:"type:text;not null;default:'private';check:visibility IN ('public', 'private')"`
	Status      string `gorm:"type:text;not null;default:'notReady';check:status IN ('notReady', 'ready')"`
	FilePath    string `gorm:"type:text;not null"`
	FileSize    int64  `gorm:"type:bigint;not null;default:0;check:file_size >= 0"`
	DurationMs  int64  `gorm:"type:bigint;not null;default:0;check:duration_ms >= 0"`
	MimeType    string `gorm:"type:text;not null"`
}
