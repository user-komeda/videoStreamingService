import { MemoryRouter } from 'react-router'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { UploadedVideoRow } from '~/feature/upload/components/UploadedVideoRow'

import type { VideoResponse } from '~/api/generated/models'

describe('UploadedVideoRow', () => {
  const sampleVideo: VideoResponse = {
    id: 'vid-1',
    title: 'My Awesome Video',
    description: 'A test description',
    visibility: VideoVisibility.Public,
    duration_ms: 65000,
    file_size: 10 * 1024 * 1024,
    status: 'Ready',
  }

  it('renders video details and triggers edit/delete handlers', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <MemoryRouter>
        <table>
          <tbody>
            <UploadedVideoRow
              video={sampleVideo}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </tbody>
        </table>
      </MemoryRouter>,
    )

    expect(screen.getByText('My Awesome Video')).toBeDefined()
    expect(screen.getByText('公開')).toBeDefined()
    expect(screen.getByText('Ready')).toBeDefined()
    expect(screen.getByText('1:05')).toBeDefined()
    expect(screen.getByText('10 MB')).toBeDefined()

    const editBtn = screen.getByTitle('編集')
    fireEvent.click(editBtn)
    expect(onEdit).toHaveBeenCalledWith(sampleVideo)

    const deleteBtn = screen.getByTitle('削除')
    fireEvent.click(deleteBtn)
    expect(onDelete).toHaveBeenCalledWith(sampleVideo)
  })

  it('handles various visibility, missing title, and empty duration/size values', () => {
    const { rerender } = render(
      <MemoryRouter>
        <table>
          <tbody>
            <UploadedVideoRow
              video={{
                id: 'vid-2',
                visibility: 'unlisted',
                duration_ms: 0,
                file_size: 0,
                status: undefined,
              }}
              onEdit={vi.fn()}
              onDelete={vi.fn()}
            />
          </tbody>
        </table>
      </MemoryRouter>,
    )
    expect(screen.getByText('限定公開')).toBeDefined()
    expect(screen.getByText('無題')).toBeDefined()
    expect(screen.getByText('説明なし')).toBeDefined()
    expect(screen.getByText('アップロード済')).toBeDefined()

    rerender(
      <MemoryRouter>
        <table>
          <tbody>
            <UploadedVideoRow
              video={{
                id: 'vid-3',
                visibility: VideoVisibility.Private,
              }}
              onEdit={vi.fn()}
              onDelete={vi.fn()}
            />
          </tbody>
        </table>
      </MemoryRouter>,
    )
    expect(screen.getByText('非公開')).toBeDefined()

    rerender(
      <MemoryRouter>
        <table>
          <tbody>
            <UploadedVideoRow
              video={{
                id: '',
                visibility: undefined,
              }}
              onEdit={vi.fn()}
              onDelete={vi.fn()}
            />
          </tbody>
        </table>
      </MemoryRouter>,
    )
    expect(screen.getByText('未設定')).toBeDefined()
  })
})
