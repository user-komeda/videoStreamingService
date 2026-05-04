# Project Guidelines

## Project Overview
This is a video streaming service monorepo managed with TurboRepo.

### Project Structure
- `apps/backend`: Go backend using [Uber Fx](https://github.com/uber-go/fx) for dependency injection. It follows a layered architecture:
  - `app`: Application entry point and server setup.
  - `application`: Use cases and application logic.
  - `domain`: Domain entities and repository interfaces.
  - `infrastructure`: Concrete implementations of repositories and external services (e.g., MinIO).
  - `presentation`: Controllers and HTTP handlers.
  - `route`: Routing definitions.
  - `lib/tus`: TUS (resumable upload) integration.
- `apps/frontend`: Frontend built with [React Router](https://reactrouter.com/) and [Vite](https://vitejs.dev/).
  - Uses [Uppy](https://uppy.io/) for resumable video uploads.
  - Follows a feature-based structure in `src/feature`.

### Development & Build
- Root `package.json` contains scripts to manage the monorepo using Turbo:
  - `yarn build`: Build all applications.
  - `yarn dev`: Start all applications in development mode.
  - `yarn check`: Run checks (linting/static analysis) across the project.
- `docker-compose.yml` is used to manage infrastructure dependencies.

### Coding Guidelines
- **Backend (Go)**:
  - Use `fx` for dependency injection.
  - Follow the established layered architecture.
  - Use `golangci-lint` for linting (config in `.golangci.yml`).
- **Frontend (TypeScript/React)**:
  - Follow React Router conventions.
  - Use Prettier and ESLint for code style.

### Testing
- Run tests using `turbo run test` if available, or navigate to specific app directories to run language-specific test commands (e.g., `go test ./...`).
