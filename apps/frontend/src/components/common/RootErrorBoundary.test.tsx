import type * as ReactRouter from 'react-router'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RootErrorBoundary } from '~/components/common/RootErrorBoundary'

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouter>()
  return {
    ...actual,
    isRouteErrorResponse: (error: unknown) =>
      Boolean(error && typeof error === 'object' && 'status' in error),
  }
})

describe('RootErrorBoundary', () => {
  it('renders generic error details and triggers reload on click', () => {
    const originalLocation = window.location
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, reload: reloadMock },
      writable: true,
    })

    const error = new Error('Custom failure')
    error.stack = 'Error: Custom failure\n    at test.js:1:1'
    render(<RootErrorBoundary error={error} />)

    expect(screen.getByText('再読み込み')).toBeDefined()
    expect(screen.getByText('Stack Trace')).toBeDefined()
    expect(screen.getByText('Custom failure')).toBeDefined()

    fireEvent.click(screen.getByText('再読み込み'))
    expect(reloadMock).toHaveBeenCalled()

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    })
  })

  it('renders 404 error response', () => {
    const routeError = {
      status: 404,
      statusText: 'Not Found',
      data: null,
    }

    render(<RootErrorBoundary error={routeError} />)

    expect(screen.getByText('404')).toBeDefined()
    expect(
      screen.getByText('The requested page could not be found.'),
    ).toBeDefined()
  })

  it('renders non-404 error response with statusText', () => {
    const routeError = {
      status: 500,
      statusText: 'Internal Server Error',
      data: null,
    }

    render(<RootErrorBoundary error={routeError} />)

    expect(screen.getByText('Error')).toBeDefined()
    expect(screen.getByText('Internal Server Error')).toBeDefined()
  })

  it('renders non-404 error response with fallback statusText', () => {
    const routeError = {
      status: 500,
      statusText: '',
      data: null,
    }

    render(<RootErrorBoundary error={routeError} />)

    expect(screen.getByText('Error')).toBeDefined()
    expect(screen.getByText('An unexpected error occurred.')).toBeDefined()
  })

  it('renders fallback for non-Error and non-route-response errors', () => {
    render(<RootErrorBoundary error="string error" />)

    expect(screen.getByText('Oops!')).toBeDefined()
    expect(screen.getByText('An unexpected error occurred.')).toBeDefined()
  })
})
