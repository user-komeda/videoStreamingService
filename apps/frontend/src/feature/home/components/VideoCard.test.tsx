import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { VideoCard } from '~/feature/home/components/VideoCard'

import type { VideoResponse } from '~/api/generated/models'

describe('VideoCard', () => {
  const video: VideoResponse = {
    id: 'v-123',
    title: 'Intro to Go and React',
    description: 'Learn modern full stack',
    duration_ms: 125000,
    visibility: VideoVisibility.Public,
  }

  it('renders video title, duration and link', () => {
    render(
      <MemoryRouter>
        <VideoCard video={video} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Intro to Go and React')).toBeDefined()
    expect(screen.getByText('2:05')).toBeDefined()

    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/videos/v-123')
  })

  it('renders without duration badge when duration_ms is undefined or 0', () => {
    const videoNoDuration: VideoResponse = {
      ...video,
      duration_ms: undefined,
    }
    const { rerender } = render(
      <MemoryRouter>
        <VideoCard video={videoNoDuration} />
      </MemoryRouter>,
    )

    expect(screen.queryByText('2:05')).toBeNull()

    rerender(
      <MemoryRouter>
        <VideoCard video={{ ...video, duration_ms: 0 }} />
      </MemoryRouter>,
    )
    expect(screen.queryByText('2:05')).toBeNull()
  })
})
