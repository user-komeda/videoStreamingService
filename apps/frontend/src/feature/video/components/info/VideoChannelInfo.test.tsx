import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { VideoChannelInfo } from '~/feature/video/components/info/VideoChannelInfo'

import type { VideoResponse } from '~/api/generated/models'

describe('VideoChannelInfo', () => {
  const mockVideo: VideoResponse = {
    id: 'vid-1',
    title: 'Title',
    description: 'Desc',
    visibility: VideoVisibility.Public,
  }

  it('renders unsubscribe state and handles toggle', () => {
    const onToggleSubscribe = vi.fn()
    const { rerender } = render(
      <VideoChannelInfo
        video={mockVideo}
        isSubscribed={false}
        onToggleSubscribe={onToggleSubscribe}
      />,
    )

    expect(screen.getByText('チャンネル登録')).toBeDefined()
    fireEvent.click(screen.getByText('チャンネル登録'))
    expect(onToggleSubscribe).toHaveBeenCalledTimes(1)

    rerender(
      <VideoChannelInfo
        video={mockVideo}
        isSubscribed={true}
        onToggleSubscribe={onToggleSubscribe}
      />,
    )
    expect(screen.getByText('登録済み')).toBeDefined()
  })
})
