import { fireEvent, render, screen } from '@testing-library/react'
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
    it('renders and fires onChange', () => {
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

      fireEvent.change(input, { target: { value: 'New Title' } })
      expect(onChange).toHaveBeenCalledWith('New Title')

      fireEvent.blur(input)
      expect(onBlur).toHaveBeenCalledTimes(1)
    })
  })

  describe('DescriptionField', () => {
    it('renders and fires onChange', () => {
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

      fireEvent.change(textarea, { target: { value: 'New Desc' } })
      expect(onChange).toHaveBeenCalledWith('New Desc')
    })
  })

  describe('VisibilityField', () => {
    it('renders and fires onChange', () => {
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
      fireEvent.change(select, {
        target: { value: VideoVisibility.Private },
      })
      expect(onChange).toHaveBeenCalledWith(VideoVisibility.Private)
    })
  })
})
