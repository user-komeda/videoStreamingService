import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'

export default [
  index('routes/home/route.tsx'),
  route('videos', 'routes/video/route.tsx'),
  route('videos/:id', 'routes/video/[id]/route.tsx'),
  layout('layout/upload/layout.tsx', [
    route('upload', 'routes/upload/route.tsx'),
  ]),
] satisfies RouteConfig
