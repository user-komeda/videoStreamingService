import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { VideoDeleteDialog } from '~/feature/upload/components/VideoDeleteDialog'

import type { VideoResponse } from '~/api/generated/models'

describe('VideoDeleteDialog', () => {
  const video: VideoResponse = {
    id: 'vid-1',
    title: 'Delete Me',
    visibility: VideoVisibility.Public,
  }

  it('returns null when isOpen is false or video is null', () => {
    const { container, rerender } = render(
      <VideoDeleteDialog
        video={null}
        isOpen={false}
        isDeleting={false}
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(container.innerHTML).toBe('')

    rerender(
      <VideoDeleteDialog
        video={video}
        isOpen={false}
        isDeleting={false}
        onConfirm={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('handles checkbox toggle, confirmation and cancellation', () => {
    const onConfirm = vi.fn()
    const onClose = vi.fn()

    const { rerender } = render(
      <VideoDeleteDialog
        video={video}
        isOpen={true}
        isDeleting={false}
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    )

    expect(screen.getByText('この動画を完全に削除しますか？')).toBeDefined()
    expect(screen.getByText('Delete Me')).toBeDefined()

    const confirmBtn = screen.getByRole('button', { name: '完全に削除' })
    expect(confirmBtn.hasAttribute('disabled')).toBe(true)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(confirmBtn.hasAttribute('disabled')).toBe(false)

    fireEvent.click(confirmBtn)
    expect(onConfirm).toHaveBeenCalledTimes(1)

    const cancelBtn = screen.getByRole('button', { name: 'キャンセル' })
    fireEvent.click(cancelBtn)
    expect(onClose).toHaveBeenCalledTimes(1)

    rerender(
      <VideoDeleteDialog
        video={video}
        isOpen={true}
        isDeleting={true}
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    )
    expect(screen.getByText('削除中...')).toBeDefined()

    rerender(
      <VideoDeleteDialog
        video={{ ...video, title: '' }}
        isOpen={true}
        isDeleting={false}
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    )
    expect(screen.getByText('無題')).toBeDefined()
  })
})
