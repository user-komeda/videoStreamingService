import { MemoryRouter } from 'react-router'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { UploadedVideoTable } from '~/feature/upload/components/UploadedVideoTable'

import type * as TanstackReactQuery from '@tanstack/react-query'

const mockDeleteMutate = vi.fn()
const mockEditMutate = vi.fn()

const sampleVideos = [
  {
    id: 'vid-1',
    title: 'My Video',
    description: 'Desc',
    visibility: VideoVisibility.Public,
    createdAt: '',
    updatedAt: '',
  },
]

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof TanstackReactQuery>()
  return {
    ...actual,
    useQuery: () => ({
      data: sampleVideos,
      isLoading: false,
    }),
  }
})

let currentDeleteTarget: unknown = null
let currentEditTarget: unknown = null

vi.mock('~/feature/upload/hooks/useVideoTableMutations', () => ({
  useVideoTableMutations: () => ({
    deleteTarget: currentDeleteTarget,
    setDeleteTarget: (val: unknown) => {
      currentDeleteTarget = val
    },
    editTarget: currentEditTarget,
    setEditTarget: (val: unknown) => {
      currentEditTarget = val
    },
    deleteMutation: {
      mutate: mockDeleteMutate,
      isPending: false,
    },
    editMutation: {
      mutate: mockEditMutate,
      isPending: false,
    },
  }),
}))

describe('UploadedVideoTable', () => {
  it('renders table headers and rows and handles edit/delete dialog confirmations', () => {
    const { rerender } = render(
      <MemoryRouter>
        <UploadedVideoTable />
      </MemoryRouter>,
    )

    expect(screen.getByText('アップロード済み動画')).toBeDefined()
    expect(screen.getByText('My Video')).toBeDefined()

    // Test Delete Dialog flow
    currentDeleteTarget = sampleVideos[0]
    rerender(
      <MemoryRouter>
        <UploadedVideoTable />
      </MemoryRouter>,
    )

    expect(screen.getByText('この動画を完全に削除しますか？')).toBeDefined()
    const cancelDeleteBtn = screen.getByRole('button', { name: 'キャンセル' })
    fireEvent.click(cancelDeleteBtn)

    // Reopen delete dialog to test confirm
    currentDeleteTarget = sampleVideos[0]
    rerender(
      <MemoryRouter>
        <UploadedVideoTable />
      </MemoryRouter>,
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const confirmDeleteBtn = screen.getByRole('button', { name: '完全に削除' })
    fireEvent.click(confirmDeleteBtn)
    expect(mockDeleteMutate).toHaveBeenCalledWith('vid-1')

    // Close delete dialog
    currentDeleteTarget = null

    // Test Edit Dialog flow
    currentEditTarget = sampleVideos[0]
    rerender(
      <MemoryRouter>
        <UploadedVideoTable />
      </MemoryRouter>,
    )

    expect(screen.getByText('動画の編集')).toBeDefined()
    const cancelEditBtn = screen.getByRole('button', { name: 'キャンセル' })
    fireEvent.click(cancelEditBtn)

    // Reopen edit dialog to test save
    currentEditTarget = sampleVideos[0]
    rerender(
      <MemoryRouter>
        <UploadedVideoTable />
      </MemoryRouter>,
    )

    const saveBtn = screen.getByRole('button', { name: '保存' })
    fireEvent.click(saveBtn)
    expect(mockEditMutate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'vid-1' }),
    )
  })
})
