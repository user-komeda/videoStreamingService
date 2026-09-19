import React from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Upload } from '~/feature/upload/upload'

import type { useUploadState } from '~/feature/upload/hooks/useUploadState'

const mockUseUploadState = vi.fn<() => ReturnType<typeof useUploadState>>()

vi.mock('~/feature/upload/hooks/useUploadState', () => ({
  useUploadState: () => mockUseUploadState(),
}))

vi.mock('~/feature/upload/components/upload_form', () => ({
  UploadForm: () => React.createElement('div', null, 'Mock UploadForm'),
}))

vi.mock('~/feature/upload/components/UploadArea', () => ({
  UploadArea: () => React.createElement('div', null, 'Mock UploadArea'),
}))

vi.mock('~/feature/upload/components/upload_completed', () => ({
  UploadCompleted: () =>
    React.createElement('div', null, 'Mock UploadCompleted'),
}))

vi.mock('~/feature/upload/components/UploadedVideoTable', () => ({
  UploadedVideoTable: () =>
    React.createElement('div', null, 'Mock UploadedVideoTable'),
}))

describe('Upload', () => {
  it('renders corresponding step components', () => {
    mockUseUploadState.mockReturnValue({
      uppy: undefined,
      step: 'form',
      files: [],
      pct: 0,
      handleFormSuccess: vi.fn(),
      handleRemoveFile: vi.fn(),
      handleReset: vi.fn(),
    })

    const { rerender } = render(<Upload />)
    expect(screen.getByText('Mock UploadForm')).toBeDefined()
    expect(screen.getByText('Mock UploadedVideoTable')).toBeDefined()

    mockUseUploadState.mockReturnValue({
      uppy: undefined,
      step: 'upload',
      files: [{ id: 'f1', name: 'v.mp4', size: 100 }],
      pct: 50,
      handleFormSuccess: vi.fn(),
      handleRemoveFile: vi.fn(),
      handleReset: vi.fn(),
    })
    rerender(<Upload />)
    expect(screen.getByText('Mock UploadArea')).toBeDefined()

    mockUseUploadState.mockReturnValue({
      uppy: undefined,
      step: 'completed',
      files: [{ id: 'f1', name: 'v.mp4', size: 100 }],
      pct: 100,
      handleFormSuccess: vi.fn(),
      handleRemoveFile: vi.fn(),
      handleReset: vi.fn(),
    })
    rerender(<Upload />)
    expect(screen.getByText('Mock UploadCompleted')).toBeDefined()
  })
})
