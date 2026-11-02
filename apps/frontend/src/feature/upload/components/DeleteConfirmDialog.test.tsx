import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DeleteConfirmDialog } from '~/feature/upload/components/DeleteConfirmDialog'

describe('DeleteConfirmDialog', () => {
  it('returns null when isOpen is false', () => {
    const { container } = render(
      <DeleteConfirmDialog
        isOpen={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders with fileName and triggers onConfirm/onCancel', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <DeleteConfirmDialog
        isOpen={true}
        fileName="test-video.mp4"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )

    expect(screen.getByText('アップロードを取り消しますか？')).toBeDefined()
    expect(screen.getByText('test-video.mp4')).toBeDefined()

    await user.click(screen.getByRole('button', { name: 'キャンセル' }))
    expect(onCancel).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: '削除する' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('renders fallback text when fileName is not provided', () => {
    render(
      <DeleteConfirmDialog
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(
      screen.getByText(
        'アップロードを破棄して最初からやり直します。この操作は取り消せません。',
      ),
    ).toBeDefined()
  })
})
