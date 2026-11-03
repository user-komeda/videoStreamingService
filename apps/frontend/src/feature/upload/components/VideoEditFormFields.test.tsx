import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import {
  EditDescriptionField,
  EditTitleField,
  EditVisibilityField,
} from '~/feature/upload/components/VideoEditFormFields'

describe('VideoEditFormFields', () => {
  it('handles EditTitleField', async () => {
    const user = userEvent.setup()
    const setTitle = vi.fn()
    render(<EditTitleField title="Existing" setTitle={setTitle} />)

    const input = screen.getByLabelText('タイトル')
    expect((input as HTMLInputElement).value).toBe('Existing')

    await user.clear(input)
    await user.type(input, 'New title')
    expect(setTitle).toHaveBeenCalled()
  })

  it('handles EditDescriptionField', async () => {
    const user = userEvent.setup()
    const setDescription = vi.fn()
    render(
      <EditDescriptionField
        description="Existing desc"
        setDescription={setDescription}
      />,
    )

    const textarea = screen.getByLabelText('説明')
    expect((textarea as HTMLTextAreaElement).value).toBe('Existing desc')

    await user.clear(textarea)
    await user.type(textarea, 'New desc')
    expect(setDescription).toHaveBeenCalled()
  })

  it('handles EditVisibilityField', async () => {
    const user = userEvent.setup()
    const setVisibility = vi.fn()
    render(
      <EditVisibilityField
        visibility={VideoVisibility.Public}
        setVisibility={setVisibility}
      />,
    )

    const select = screen.getByLabelText('公開設定')
    await user.selectOptions(select, 'private')
    expect(setVisibility).toHaveBeenCalledWith('private')
  })
})
