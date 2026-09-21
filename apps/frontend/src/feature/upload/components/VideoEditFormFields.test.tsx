import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import {
  EditDescriptionField,
  EditTitleField,
  EditVisibilityField,
} from '~/feature/upload/components/VideoEditFormFields'

describe('VideoEditFormFields', () => {
  it('handles EditTitleField', () => {
    const setTitle = vi.fn()
    render(<EditTitleField title="Existing" setTitle={setTitle} />)

    const input = screen.getByLabelText('タイトル')
    expect((input as HTMLInputElement).value).toBe('Existing')

    fireEvent.change(input, { target: { value: 'New title' } })
    expect(setTitle).toHaveBeenCalledWith('New title')
  })

  it('handles EditDescriptionField', () => {
    const setDescription = vi.fn()
    render(
      <EditDescriptionField
        description="Existing desc"
        setDescription={setDescription}
      />,
    )

    const textarea = screen.getByLabelText('説明')
    expect((textarea as HTMLTextAreaElement).value).toBe('Existing desc')

    fireEvent.change(textarea, { target: { value: 'New desc' } })
    expect(setDescription).toHaveBeenCalledWith('New desc')
  })

  it('handles EditVisibilityField', () => {
    const setVisibility = vi.fn()
    render(
      <EditVisibilityField
        visibility={VideoVisibility.Public}
        setVisibility={setVisibility}
      />,
    )

    const select = screen.getByLabelText('公開設定')
    fireEvent.change(select, { target: { value: 'private' } })
    expect(setVisibility).toHaveBeenCalledWith('private')
  })
})
