import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  layout('../src/feature/upload/layout.tsx', [
    route('upload', 'routes/upload.tsx'),
  ]),
] satisfies RouteConfig
