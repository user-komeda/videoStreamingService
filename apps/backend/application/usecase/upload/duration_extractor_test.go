package upload_test

import (
	"bytes"
	"encoding/binary"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"

	"videoStreaming/application/usecase/upload"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func buildTestMP4WithDuration(duration uint32, timescale uint32) []byte {
	mvhdPayload := new(bytes.Buffer)
	mvhdPayload.WriteByte(0)
	mvhdPayload.Write([]byte{0, 0, 0})
	_ = binary.Write(mvhdPayload, binary.BigEndian, uint32(0))
	_ = binary.Write(mvhdPayload, binary.BigEndian, uint32(0))
	_ = binary.Write(mvhdPayload, binary.BigEndian, timescale)
	_ = binary.Write(mvhdPayload, binary.BigEndian, duration)
	_ = binary.Write(mvhdPayload, binary.BigEndian, uint32(0x00010000))
	_ = binary.Write(mvhdPayload, binary.BigEndian, uint16(0x0100))
	mvhdPayload.Write(make([]byte, 10))
	mvhdPayload.Write(make([]byte, 36))
	mvhdPayload.Write(make([]byte, 24))
	_ = binary.Write(mvhdPayload, binary.BigEndian, uint32(2))

	mvhdBox := new(bytes.Buffer)
	_ = binary.Write(mvhdBox, binary.BigEndian, uint32(8+mvhdPayload.Len()))
	mvhdBox.WriteString("mvhd")
	mvhdBox.Write(mvhdPayload.Bytes())

	moovBox := new(bytes.Buffer)
	_ = binary.Write(moovBox, binary.BigEndian, uint32(8+mvhdBox.Len()))
	moovBox.WriteString("moov")
	moovBox.Write(mvhdBox.Bytes())

	ftypBox := new(bytes.Buffer)
	ftypPayload := []byte("isom\x00\x00\x02\x00isomiso2mp41")
	_ = binary.Write(ftypBox, binary.BigEndian, uint32(8+len(ftypPayload)))
	ftypBox.WriteString("ftyp")
	ftypBox.Write(ftypPayload)

	result := new(bytes.Buffer)
	result.Write(ftypBox.Bytes())
	result.Write(moovBox.Bytes())
	return result.Bytes()
}

func setupTestS3Client(t *testing.T, data []byte) *s3.Client {
	t.Helper()
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		rangeHeader := r.Header.Get("Range")
		if rangeHeader != "" && strings.HasPrefix(rangeHeader, "bytes=") {
			rangeSpec := strings.TrimPrefix(rangeHeader, "bytes=")
			parts := strings.Split(rangeSpec, "-")
			start, _ := strconv.ParseInt(parts[0], 10, 64)
			end, _ := strconv.ParseInt(parts[1], 10, 64)
			if end >= int64(len(data)) {
				end = int64(len(data)) - 1
			}
			w.Header().
				Set("Content-Range", "bytes "+strconv.FormatInt(start, 10)+"-"+strconv.FormatInt(end, 10)+"/"+strconv.Itoa(len(data)))
			w.WriteHeader(http.StatusPartialContent)
			_, _ = w.Write(data[start : end+1])
			return
		}
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(data)
	}))
	t.Cleanup(server.Close)

	awsCfg, err := config.LoadDefaultConfig(
		t.Context(),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider("key", "secret", "")),
		config.WithRegion("us-east-1"),
	)
	if err != nil {
		t.Fatalf("failed to load aws config: %v", err)
	}

	return s3.NewFromConfig(awsCfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(server.URL)
		o.UsePathStyle = true
	})
}

func TestExtractMP4DurationMs_Success(t *testing.T) {
	mp4Data := buildTestMP4WithDuration(45000, 1000)
	client := setupTestS3Client(t, mp4Data)

	durationMs := upload.ExtractMP4DurationMs(
		t.Context(),
		client,
		"bucket",
		"video.mp4",
		int64(len(mp4Data)),
	)
	if durationMs != 45000 {
		t.Fatalf("expected 45000 ms, got %d", durationMs)
	}
}

func TestExtractMP4DurationMs_Validation(t *testing.T) {
	mp4Data := buildTestMP4WithDuration(60000, 1000)
	client := setupTestS3Client(t, mp4Data)

	for _, tc := range []struct {
		c *s3.Client
		b string
		k string
		s int64
	}{
		{c: nil, b: "b", k: "k", s: 100},
		{c: client, b: "", k: "k", s: 100},
		{c: client, b: "b", k: "", s: 100},
		{c: client, b: "b", k: "k", s: 0},
		{c: client, b: "b", k: "k", s: -1},
	} {
		d := upload.ExtractMP4DurationMs(t.Context(), tc.c, tc.b, tc.k, tc.s)
		if d != 0 {
			t.Fatalf("expected 0, got %d", d)
		}
	}
}

func TestExtractMP4DurationMs_EdgeCases(t *testing.T) {
	t.Run("zero timescale returns 0", func(t *testing.T) {
		zeroData := buildTestMP4WithDuration(60000, 0)
		zeroClient := setupTestS3Client(t, zeroData)
		d := upload.ExtractMP4DurationMs(
			t.Context(),
			zeroClient,
			"bucket",
			"video.mp4",
			int64(len(zeroData)),
		)
		if d != 0 {
			t.Fatalf("expected 0, got %d", d)
		}
	})

	t.Run("invalid box size returns 0", func(t *testing.T) {
		client := setupTestS3Client(t, []byte("data"))
		d := upload.ExtractMP4DurationMs(t.Context(), client, "bucket", "video.mp4", 4)
		if d != 0 {
			t.Fatalf("expected 0, got %d", d)
		}
	})

	t.Run("box read beyond size triggers EOF", func(t *testing.T) {
		mp4Data := buildTestMP4WithDuration(60000, 1000)
		client := setupTestS3Client(t, mp4Data)
		d := upload.ExtractMP4DurationMs(t.Context(), client, "bucket", "video.mp4", 50)
		if d != 0 {
			t.Fatalf("expected 0, got %d", d)
		}
	})

	t.Run("s3 returns truncated stream causing unexpected EOF", func(t *testing.T) {
		truncatedServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
			w.Header().Set("Content-Range", "bytes 0-100/200")
			w.WriteHeader(http.StatusPartialContent)
			_, _ = w.Write([]byte("short"))
		}))
		defer truncatedServer.Close()

		awsCfg, _ := config.LoadDefaultConfig(
			t.Context(),
			config.WithRegion("us-east-1"),
			config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider("k", "s", "")),
		)
		truncatedClient := s3.NewFromConfig(awsCfg, func(o *s3.Options) {
			o.BaseEndpoint = aws.String(truncatedServer.URL)
			o.UsePathStyle = true
		})

		d := upload.ExtractMP4DurationMs(t.Context(), truncatedClient, "bucket", "video.mp4", 100)
		if d != 0 {
			t.Fatalf("expected 0, got %d", d)
		}
	})

	t.Run("s3 get object error returns 0", func(t *testing.T) {
		errServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
			w.WriteHeader(http.StatusInternalServerError)
		}))
		defer errServer.Close()

		awsCfg, _ := config.LoadDefaultConfig(
			t.Context(),
			config.WithRegion("us-east-1"),
			config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider("k", "s", "")),
		)
		errClient := s3.NewFromConfig(awsCfg, func(o *s3.Options) {
			o.BaseEndpoint = aws.String(errServer.URL)
			o.UsePathStyle = true
		})

		d := upload.ExtractMP4DurationMs(t.Context(), errClient, "bucket", "video.mp4", 100)
		if d != 0 {
			t.Fatalf("expected 0, got %d", d)
		}
	})
}
