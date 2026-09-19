package upload

import (
	"context"
	"errors"
	"fmt"
	"io"

	"github.com/alfg/mp4"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// s3ReaderAt implements [io.ReaderAt] on top of S3 GetObject using Range requests.
type s3ReaderAt struct {
	ctx      context.Context
	s3Client *s3.Client
	bucket   string
	key      string
	size     int64
}

func (r *s3ReaderAt) ReadAt(p []byte, off int64) (int, error) {
	end := min(off+int64(len(p))-1, r.size-1)
	rangeHeader := fmt.Sprintf("bytes=%d-%d", off, end)
	resp, err := r.s3Client.GetObject(r.ctx, &s3.GetObjectInput{
		Bucket: aws.String(r.bucket),
		Key:    aws.String(r.key),
		Range:  aws.String(rangeHeader),
	})
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	n, err := io.ReadFull(resp.Body, p[:end-off+1])
	if errors.Is(err, io.ErrUnexpectedEOF) {
		err = io.EOF
	}
	return n, err
}

const msPerSecond = 1000

// ExtractMP4DurationMs reads MP4 metadata from S3 using Range requests and calculates duration in milliseconds.
func ExtractMP4DurationMs(
	ctx context.Context,
	s3Client *s3.Client,
	bucket string,
	key string,
	size int64,
) int64 {
	if s3Client == nil || bucket == "" || key == "" || size <= 0 {
		return 0
	}

	readerAt := &s3ReaderAt{
		ctx:      ctx,
		s3Client: s3Client,
		bucket:   bucket,
		key:      key,
		size:     size,
	}

	parsedMP4, _ := mp4.OpenFromReader(readerAt, size)
	if parsedMP4 == nil || parsedMP4.Moov == nil || parsedMP4.Moov.Mvhd == nil ||
		parsedMP4.Moov.Mvhd.Timescale == 0 {
		return 0
	}

	duration := parsedMP4.Moov.Mvhd.Duration
	timescale := parsedMP4.Moov.Mvhd.Timescale

	//nolint:gosec // mp4 duration fits within int64
	return int64((uint64(duration) * msPerSecond) / uint64(timescale))
}
