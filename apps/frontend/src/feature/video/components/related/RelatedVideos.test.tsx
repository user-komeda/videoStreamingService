import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RelatedVideos } from '~/feature/video/components/related/RelatedVideos'

describe('RelatedVideos', () => {
  const sampleVideos = [
    {
      id: 'rel-1',
      title: 'Related Video 1',
      thumbnailUrl: 'https://example.com/t.jpg',
      channelName: 'Channel 1',
      views: '1万回視聴',
      uploadedAt: '1日前',
      duration: '5:00',
    },
  ]

  it('renders video cards and handles empty list fallback', () => {
    const { rerender } = render(
      <MemoryRouter>
        <RelatedVideos videos={sampleVideos} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Related Video 1')).toBeDefined()

    rerender(
      <MemoryRouter>
        <RelatedVideos />
      </MemoryRouter>,
    )
    expect(screen.queryByText('Related Video 1')).toBeNull()
  })
})
