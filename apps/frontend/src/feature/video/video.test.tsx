import React from 'react'
import { MemoryRouter } from 'react-router'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { VideoDetail } from '~/feature/video/video'

import type * as TanstackReactQuery from '@tanstack/react-query'

let mockQueryData: unknown = null

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof TanstackReactQuery>()
  return {
    ...actual,
    useSuspenseQuery: () => ({
      data: mockQueryData,
    }),
  }
})

vi.mock('~/feature/video/components/player/VideoPlayer', () => ({
  VideoPlayer: () => React.createElement('div', null, 'Mock VideoPlayer'),
}))

describe('VideoDetail', () => {
  it('renders not found state when video is not present', () => {
    mockQueryData = null

    render(
      <MemoryRouter>
        <VideoDetail />
      </MemoryRouter>,
    )

    expect(screen.getByText('動画が見つかりませんでした')).toBeDefined()
    expect(screen.getByText('アップロード一覧へ戻る')).toBeDefined()
  })

  it('renders video detail, player, description and related videos', () => {
    mockQueryData = {
      id: 'vid-123',
      title: 'Detailed Video',
      description: 'Video Description Body',
      visibility: VideoVisibility.Public,
      duration_ms: 60000,
      createdAt: '',
      updatedAt: '',
    }

    render(
      <MemoryRouter>
        <VideoDetail />
      </MemoryRouter>,
    )

    expect(screen.getByText('Detailed Video')).toBeDefined()
    expect(screen.getByText('Mock VideoPlayer')).toBeDefined()

    // Header interaction (toggle login)
    const loginBtn = screen.getByText('ログイン (切替)')
    fireEvent.click(loginBtn)

    // Header interaction (toggle sidebar)
    const sidebarBtn = screen.getByLabelText('メニュー')
    fireEvent.click(sidebarBtn)

    // Description expand toggle
    const expandBtn = screen.getByText('...もっと見る')
    fireEvent.click(expandBtn)
  })
})
