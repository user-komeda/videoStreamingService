# Development & Operations Guide

## Monorepo Commands
Root `package.json` manages monorepo tasks with TurboRepo:

- `yarn build`: Build all applications.
- `yarn dev`: Start all applications in development mode.
- `yarn check`: Run checks (linting / typecheck / formatting) across all packages.
- `yarn test`: Run unit and integration tests across the monorepo.
- `yarn secret-check`: Run secret leakage check using `betterleaks`.
- `yarn swagger`: Generate backend OpenAPI / Swagger documentation (`gen/swagger`).

## Infrastructure & Local Environment (Docker)
- `docker-compose.yml`: Local PostgreSQL and related services.
- `yarn compose-up`: Start PostgreSQL using `infisicalLauncher`.
- `yarn compose-up-all`: Start all containers including frontend and backend.
- `yarn compose-down`: Stop containers.

## Testing
- Run all monorepo tests: `yarn test`.
- Backend: `yarn test` (inside `apps/backend`).
- Frontend: `yarn test` (inside `apps/frontend`).
