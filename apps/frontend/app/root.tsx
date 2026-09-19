import { useEffect, useState } from 'react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { RootErrorBoundary } from '~/components/common/RootErrorBoundary'

import type { Route } from './+types/root'
import './app.css'

export const meta: Route.MetaFunction = () => [
  { title: 'Video Streaming Service' },
  { name: 'description', content: 'Video Streaming Service application' },
]

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
          },
        },
      }),
  )

  useEffect(() => {
    if (import.meta.env.DEV) {
      void import('web-vitals').then(
        ({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
          onCLS(console.warn)
          onINP(console.warn)
          onLCP(console.warn)
          onFCP(console.warn)
          onTTFB(console.warn)
        },
      )
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}
export default App

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => (
  <RootErrorBoundary error={error} />
)
