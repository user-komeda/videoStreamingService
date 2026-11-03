import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import {
  DescriptionField,
  FieldInfo,
  TitleField,
  VisibilityField,
} from '~/feature/upload/components/UploadFormFields'

describe('UploadFormFields', () => {
  describe('FieldInfo', () => {
    it('renders error message when touched and errors exist', () => {
      render(
        <FieldInfo
          isTouched={true}
          errors={[
            'Title is required',
            { message: 'Must be valid' },
            123,
            { other: 'no message prop' },
          ]}
        />,
      )
      expect(
        screen.getByText(
          'Title is required, Must be valid, 123, [object Object]',
        ),
      ).toBeDefined()
    })

    it('renders validating indicator', () => {
      render(<FieldInfo isValidating={true} />)
      expect(screen.getByText('検証中...')).toBeDefined()
    })
  })

  describe('TitleField', () => {
    it('renders and fires onChange', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const onBlur = vi.fn()
      render(
        <TitleField
          name="title"
          value="My Video"
          onChange={onChange}
          onBlur={onBlur}
        />,
      )

      const input = screen.getByPlaceholderText('動画のタイトルを入力')
      expect((input as HTMLInputElement).value).toBe('My Video')

      await user.clear(input)
      await user.type(input, 'New Title')
      expect(onChange).toHaveBeenCalled()

      await user.tab()
      expect(onBlur).toHaveBeenCalled()
    })
  })

  describe('DescriptionField', () => {
    it('renders and fires onChange', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const onBlur = vi.fn()
      render(
        <DescriptionField
          name="description"
          value="Desc text"
          onChange={onChange}
          onBlur={onBlur}
        />,
      )

      const textarea = screen.getByPlaceholderText('動画の説明を入力')
      expect((textarea as HTMLTextAreaElement).value).toBe('Desc text')

      await user.clear(textarea)
      await user.type(textarea, 'New Desc')
      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('VisibilityField', () => {
    it('renders and fires onChange', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const onBlur = vi.fn()
      render(
        <VisibilityField
          name="visibility"
          value={VideoVisibility.Public}
          onChange={onChange}
          onBlur={onBlur}
        />,
      )

      const select = screen.getByRole('combobox')
      await user.selectOptions(select, VideoVisibility.Private)
      expect(onChange).toHaveBeenCalledWith(VideoVisibility.Private)
    })
  })
})
