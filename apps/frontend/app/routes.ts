import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'

export default [
  index('routes/video/route.tsx', { id: 'home' }),
  route('health', 'routes/health.ts'),
  route('videos', 'routes/video/route.tsx', { id: 'videos' }),
  route('videos/:id', 'routes/video/[id]/route.tsx'),
  layout('layout/upload/layout.tsx', [
    route('upload', 'routes/upload/route.tsx'),
  ]),
] satisfies RouteConfig
