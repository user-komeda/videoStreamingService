import type React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { VideoDescription } from '~/feature/video/components/info/VideoDescription'

import type { VideoResponse } from '~/api/generated/models'

describe('VideoDescription', () => {
  const mockVideo: VideoResponse = {
    id: 'vid-1',
    title: 'Title',
    description: 'Line 1\nLine 2\nLine 3',
    visibility: VideoVisibility.Public,
  }

  it('renders collapsed description and handles toggle expansion', () => {
    const setIsExpanded =
      vi.fn<(action: React.SetStateAction<boolean>) => void>()
    const { rerender } = render(
      <VideoDescription
        video={mockVideo}
        isExpanded={false}
        setIsExpanded={setIsExpanded}
      />,
    )

    expect(
      screen.getByText((content) => content.includes('Line 1')),
    ).toBeDefined()
    expect(screen.getByText('...もっと見る')).toBeDefined()

    fireEvent.click(screen.getByText('...もっと見る'))
    expect(setIsExpanded).toHaveBeenCalledTimes(1)
    const updater = setIsExpanded.mock.calls[0]?.[0]
    expect(typeof updater === 'function' ? updater(false) : updater).toBe(true)

    rerender(
      <VideoDescription
        video={mockVideo}
        isExpanded={true}
        setIsExpanded={setIsExpanded}
      />,
    )
    expect(screen.getByText('一部を表示')).toBeDefined()
  })
})
