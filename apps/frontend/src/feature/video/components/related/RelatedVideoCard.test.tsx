import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RelatedVideoCard } from '~/feature/video/components/related/RelatedVideoCard'

describe('RelatedVideoCard', () => {
  const video = {
    id: 'vid-100',
    title: 'Awesome Tutorial',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    channelName: 'Code Channel',
    views: '10万回視聴',
    uploadedAt: '3日前',
    duration: '10:00',
  }

  it('renders video information and link', () => {
    const { rerender } = render(
      <MemoryRouter>
        <RelatedVideoCard video={video} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Awesome Tutorial')).toBeDefined()
    expect(screen.getByText('Code Channel')).toBeDefined()
    expect(screen.getByText('10万回視聴')).toBeDefined()
    expect(screen.getByText('3日前')).toBeDefined()

    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/video/vid-100')

    rerender(
      <MemoryRouter>
        <RelatedVideoCard video={{ ...video, isLive: true }} />
      </MemoryRouter>,
    )
    expect(screen.queryByText('3日前')).toBeNull()
  })
})
