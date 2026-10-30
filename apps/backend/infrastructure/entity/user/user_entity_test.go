package user_test

import (
	"testing"
	"time"

	domainUser "videoStreaming/domain/entity/user"
	infraUser "videoStreaming/infrastructure/entity/user"
)

func TestUserEntity_BuildFromDomain_And_ToDomain(t *testing.T) {
	now := time.Now().Truncate(time.Millisecond)
	dom, err := domainUser.Build(domainUser.Attrs{
		ID:           "user-123",
		Email:        "test@example.com",
		PasswordHash: "hashed-pw",
		CreatedAt:    now,
		UpdatedAt:    now,
	})
	if err != nil {
		t.Fatalf("unexpected error building domain user: %v", err)
	}

	entity, err := infraUser.BuildFromDomainEntity(dom)
	if err != nil {
		t.Fatalf("unexpected error building infra entity: %v", err)
	}

	if entity.ID != "user-123" || entity.Email != "test@example.com" || entity.PasswordHash != "hashed-pw" {
		t.Fatalf("entity fields mismatch: %+v", entity)
	}

	if entity.TableName() != "users" {
		t.Fatalf("expected table name 'users', got %s", entity.TableName())
	}

	converted, err := entity.ToDomain()
	if err != nil {
		t.Fatalf("unexpected error converting to domain: %v", err)
	}

	if converted.ID() != dom.ID() ||
		converted.Email() != dom.Email() ||
		converted.PasswordHash() != dom.PasswordHash() {
		t.Fatalf("converted domain user mismatch: %+v", converted)
	}
}

func TestUserEntity_BuildFromDomain_Nil(t *testing.T) {
	_, err := infraUser.BuildFromDomainEntity(nil)
	if err == nil {
		t.Fatalf("expected error when building from nil domain user, got nil")
	}
}
