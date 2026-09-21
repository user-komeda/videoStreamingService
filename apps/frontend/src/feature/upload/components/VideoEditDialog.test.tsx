import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { VideoEditDialog } from '~/feature/upload/components/VideoEditDialog'

import type { VideoResponse } from '~/api/generated/models'

describe('VideoEditDialog', () => {
  const video: VideoResponse = {
    id: 'vid-1',
    title: 'Edit Title',
    description: 'Edit Desc',
    visibility: VideoVisibility.Public,
  }

  it('returns null when isOpen is false or video is null', () => {
    const { container, rerender } = render(
      <VideoEditDialog
        video={null}
        isOpen={false}
        isUpdating={false}
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(container.innerHTML).toBe('')

    rerender(
      <VideoEditDialog
        video={video}
        isOpen={false}
        isUpdating={false}
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('handles edit form submit and cancel', () => {
    const onConfirm = vi.fn()
    const onClose = vi.fn()

    const { rerender } = render(
      <VideoEditDialog
        video={video}
        isOpen={true}
        isUpdating={false}
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    )

    expect(screen.getByText('動画の編集')).toBeDefined()
    expect(screen.getByDisplayValue('Edit Title')).toBeDefined()

    const titleInput = screen.getByDisplayValue('Edit Title')
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } })

    const saveBtn = screen.getByRole('button', { name: '保存' })
    fireEvent.click(saveBtn)

    expect(onConfirm).toHaveBeenCalledWith({
      title: 'Updated Title',
      description: 'Edit Desc',
      visibility: VideoVisibility.Public,
    })

    const cancelBtn = screen.getByRole('button', { name: 'キャンセル' })
    fireEvent.click(cancelBtn)
    expect(onClose).toHaveBeenCalledTimes(1)

    rerender(
      <VideoEditDialog
        video={video}
        isOpen={true}
        isUpdating={true}
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    )
    expect(screen.getByText('保存中...')).toBeDefined()
  })
})
