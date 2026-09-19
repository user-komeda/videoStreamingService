import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { UploadedVideoTableBody } from '~/feature/upload/components/UploadedVideoTableBody'

describe('UploadedVideoTableBody', () => {
  it('renders loading row when isLoading is true', () => {
    render(
      <table>
        <UploadedVideoTableBody
          videos={[]}
          isLoading={true}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </table>,
    )
    expect(screen.getByText('読み込み中...')).toBeDefined()
  })

  it('renders empty message when videos is empty', () => {
    render(
      <table>
        <UploadedVideoTableBody
          videos={[]}
          isLoading={false}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </table>,
    )
    expect(screen.getByText('アップロードされた動画はありません')).toBeDefined()
  })

  it('renders list of videos', () => {
    const videos = [
      {
        id: 'v-1',
        title: 'Video 1',
        description: 'Desc',
        visibility: VideoVisibility.Public,
        createdAt: '',
        updatedAt: '',
      },
    ]

    render(
      <MemoryRouter>
        <table>
          <UploadedVideoTableBody
            videos={videos}
            isLoading={false}
            onEdit={vi.fn()}
            onDelete={vi.fn()}
          />
        </table>
      </MemoryRouter>,
    )

    expect(screen.getByText('Video 1')).toBeDefined()
  })
})
