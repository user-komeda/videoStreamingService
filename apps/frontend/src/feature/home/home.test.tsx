import { MemoryRouter } from 'react-router'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { Home } from '~/feature/home/home'

import type * as TanstackReactQuery from '@tanstack/react-query'

const mockVideos = [
  {
    id: 'vid-1',
    title: 'Test Video 1',
    description: 'Desc 1',
    visibility: VideoVisibility.Public,
    duration_ms: 60000,
    createdAt: '',
    updatedAt: '',
  },
]

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof TanstackReactQuery>()
  return {
    ...actual,
    useSuspenseQuery: () => ({
      data: mockVideos,
    }),
  }
})

describe('Home', () => {
  it('renders home layout and toggles login/sidebar', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.getByText('Test Video 1')).toBeDefined()
    expect(screen.getAllByText('Shorts').length).toBeGreaterThanOrEqual(1)

    // Toggle login
    const loginBtn = screen.getByText('ログイン (切替)')
    fireEvent.click(loginBtn)

    // Toggle sidebar
    const toggleSidebarBtn = screen.getByLabelText('メニュー')
    fireEvent.click(toggleSidebarBtn)
  })
})
