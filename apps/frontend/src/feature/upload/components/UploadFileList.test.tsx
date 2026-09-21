import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UploadFileList } from '~/feature/upload/components/UploadFileList'

import type { DeleteConfirmDialogProps } from '~/feature/upload/components/DeleteConfirmDialog'
import type { FileItem } from '~/feature/upload/hooks/useUploadState'

vi.mock('~/feature/upload/components/DeleteConfirmDialog', () => ({
  DeleteConfirmDialog: ({
    isOpen,
    fileName,
    onConfirm,
    onCancel,
  }: DeleteConfirmDialogProps) => (
    <div>
      {isOpen && (
        <>
          <span>アップロードを取り消しますか？</span>
          <span>{fileName}</span>
          <button onClick={onConfirm}>削除する</button>
          <button onClick={onCancel}>キャンセル</button>
        </>
      )}
      <button data-testid="hidden-confirm" onClick={onConfirm}>
        Hidden Confirm
      </button>
    </div>
  ),
}))

describe('UploadFileList', () => {
  const files: FileItem[] = [
    { id: '1', name: 'sample1.mp4', size: 10 * 1024 * 1024 },
    { id: '2', name: 'sample2.mp4', size: null },
  ]

  it('renders file items with size and handles delete flow, cancel flow, and fallback', () => {
    const onRemoveFile = vi.fn()

    render(<UploadFileList files={files} onRemoveFile={onRemoveFile} />)

    expect(screen.getByText('sample1.mp4')).toBeDefined()
    expect(screen.getByText('10 MB')).toBeDefined()
    expect(screen.getByText('sample2.mp4')).toBeDefined()
    expect(screen.getByText('0 MB')).toBeDefined()

    // Test handleConfirm when targetFile is null
    const hiddenConfirm = screen.getByTestId('hidden-confirm')
    fireEvent.click(hiddenConfirm)
    expect(onRemoveFile).not.toHaveBeenCalled()

    // Click trash button on second file and cancel
    const trashButtons = screen.getAllByTitle('ファイルを削除')
    fireEvent.click(trashButtons[1])
    expect(screen.getAllByText('sample2.mp4').length).toBeGreaterThanOrEqual(1)

    // Cancel deletion
    fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }))
    expect(onRemoveFile).not.toHaveBeenCalled()

    // Click trash button on first file and confirm
    fireEvent.click(trashButtons[0])
    expect(screen.getByText('アップロードを取り消しますか？')).toBeDefined()

    // Confirm deletion
    fireEvent.click(screen.getByRole('button', { name: '削除する' }))
    expect(onRemoveFile).toHaveBeenCalledWith('1')
  })
})
