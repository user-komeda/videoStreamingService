import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UploadCompleted } from '~/feature/upload/components/upload_completed'

describe('UploadCompleted', () => {
  it('renders files count and triggers onReset when clicked', () => {
    const onReset = vi.fn()
    render(<UploadCompleted filesCount={3} onReset={onReset} />)

    expect(screen.getByText('アップロード完了')).toBeDefined()
    expect(screen.getByText('3 件の動画をアップロードしました')).toBeDefined()

    const button = screen.getByRole('button', {
      name: 'もう一度アップロードする',
    })
    fireEvent.click(button)

    expect(onReset).toHaveBeenCalledTimes(1)
  })
})
