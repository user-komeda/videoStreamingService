import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UploadArea } from '~/feature/upload/components/UploadArea'

import type Uppy from '@uppy/core'
import type { FileItem } from '~/feature/upload/hooks/useUploadState'

vi.mock('@uppy/react', () => ({
  useDropzone: vi.fn(() => ({
    getRootProps: () => ({ 'data-testid': 'dropzone-root' }),
    getInputProps: () => ({ 'data-testid': 'dropzone-input' }),
  })),
}))

describe('UploadArea', () => {
  it('renders dropzone, disabled upload button when no files', () => {
    const mockUppy = {
      upload: vi.fn(),
    } as unknown as Uppy

    render(
      <UploadArea files={[]} pct={0} uppy={mockUppy} onRemoveFile={vi.fn()} />,
    )

    expect(screen.getByText('動画アップロード')).toBeDefined()
    const uploadBtn = screen.getByRole('button', { name: 'アップロード開始' })
    expect((uploadBtn as HTMLButtonElement).disabled).toBe(true)
  })

  it('renders files list and triggers upload when files exist', () => {
    const uploadMock = vi.fn().mockResolvedValue(undefined)
    const mockUppy = {
      upload: uploadMock,
    } as unknown as Uppy
    const files: FileItem[] = [{ id: '1', name: 'sample.mp4', size: 1024 }]

    render(
      <UploadArea
        files={files}
        pct={30}
        uppy={mockUppy}
        onRemoveFile={vi.fn()}
      />,
    )

    expect(screen.getByText('sample.mp4')).toBeDefined()
    const uploadBtn = screen.getByRole('button', { name: 'アップロード開始' })
    expect((uploadBtn as HTMLButtonElement).disabled).toBe(false)

    fireEvent.click(uploadBtn)
    expect(uploadMock).toHaveBeenCalledTimes(1)
  })
})
