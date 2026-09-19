# videoStreamingService

Route streaming service monorepo managed with TurboRepo and Yarn Workspaces.

## Documentation
- [Architecture & Structure](docs/architecture.md)
- [Development & Operations Guide](docs/development.md)

## Quick Start

### Installation
```bash
yarn install
```

### Development
```bash
# Start local infrastructure
make compose-up

# Start dev servers
yarn dev
```

### Common Commands
- `yarn build`: Build all applications
- `yarn check`: Run lint/typecheck across workspace
- `yarn test`: Run tests
- `yarn swagger`: Generate backend Swagger documentation
