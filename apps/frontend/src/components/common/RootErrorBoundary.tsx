import { isRouteErrorResponse } from 'react-router'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const getErrorInfo = (error: unknown) => {
  if (isRouteErrorResponse(error)) {
    return {
      message: error.status === 404 ? '404' : 'Error',
      details:
        error.status === 404
          ? 'The requested page could not be found.'
          : error.statusText || 'An unexpected error occurred.',
      stack: undefined,
    }
  }

  if (import.meta.env.DEV && error && error instanceof Error) {
    return {
      message: 'Oops!',
      details: error.message,
      stack: error.stack,
    }
  }

  return {
    message: 'Oops!',
    details: 'An unexpected error occurred.',
    stack: undefined,
  }
}

export const RootErrorBoundary = ({ error }: { error: unknown }) => {
  const { message, details, stack } = getErrorInfo(error)

  return (
    <main className="container mx-auto max-w-2xl p-4 pt-16">
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>{message}</AlertTitle>
        <AlertDescription>{details}</AlertDescription>
      </Alert>

      {stack ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-mono text-sm">Stack Trace</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted text-muted-foreground max-h-96 overflow-x-auto rounded p-4 font-mono text-xs">
              <code>{stack}</code>
            </pre>
          </CardContent>
        </Card>
      ) : null}

      <Button variant="outline" onClick={() => window.location.reload()}>
        再読み込み
      </Button>
    </main>
  )
}
