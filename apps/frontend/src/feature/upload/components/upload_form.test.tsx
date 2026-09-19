import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UploadForm } from '~/feature/upload/components/upload_form'

let mockFetcherData: unknown = null

vi.mock('react-router', () => ({
  useFetcher: () => ({
    data: mockFetcherData,
    Form: ({ children, ...props }: React.ComponentProps<'form'>) =>
      React.createElement('form', props, children),
  }),
}))

describe('UploadForm', () => {
  it('renders form heading and inputs, and triggers onSuccess when fetcher data is successful', () => {
    const onSuccess = vi.fn()
    mockFetcherData = null

    const { rerender } = render(<UploadForm onSuccess={onSuccess} />)
    expect(screen.getByText('動画情報の入力')).toBeDefined()
    expect(screen.getByPlaceholderText('動画のタイトルを入力')).toBeDefined()

    mockFetcherData = {
      success: true,
      videoId: 'vid-success-123',
    }

    rerender(<UploadForm onSuccess={onSuccess} />)
    expect(onSuccess).toHaveBeenCalledWith('vid-success-123')
  })

  it('renders alert when submission has error in action data', () => {
    mockFetcherData = {
      success: false,
      error: 'Backend upload failed',
    }

    render(<UploadForm onSuccess={vi.fn()} />)
    expect(screen.getByText('Backend upload failed')).toBeDefined()
  })
})
