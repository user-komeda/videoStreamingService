import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  EmailField,
  FieldInfo,
  PasswordField,
} from '~/feature/auth/components/AuthFormFields'

describe('AuthFormFields', () => {
  describe('FieldInfo', () => {
    it('renders null when not touched', () => {
      render(<FieldInfo isTouched={false} errors={['error']} />)
      expect(screen.queryByText('error')).toBeNull()
    })

    it('renders null when there are no errors', () => {
      render(<FieldInfo isTouched={true} errors={[]} />)
      expect(screen.queryByText(/./)).toBeNull()
    })

    it('renders formatted errors from string array', () => {
      render(<FieldInfo isTouched={true} errors={['Error 1', 'Error 2']} />)
      expect(screen.getByText('Error 1, Error 2')).toBeDefined()
    })

    it('renders formatted errors from object with message property and other values', () => {
      render(
        <FieldInfo
          isTouched={true}
          errors={[{ message: 'Object error' }, 12345]}
        />,
      )
      expect(screen.getByText('Object error, 12345')).toBeDefined()
    })

    it('renders validating text when isValidating is true', () => {
      render(<FieldInfo isValidating={true} />)
      expect(screen.getByText('検証中...')).toBeDefined()
    })
  })

  describe('EmailField', () => {
    it('renders email input with label and handles onChange and onBlur', async () => {
      const user = userEvent.setup()
      const onBlur = vi.fn()
      const onChange = vi.fn()

      render(
        <EmailField
          name="email"
          value="test@example.com"
          onBlur={onBlur}
          onChange={onChange}
        />,
      )

      const input = screen.getByPlaceholderText('example@example.com')
      expect(input).toBeDefined()
      input.focus()
      input.blur()
      expect(onBlur).toHaveBeenCalled()

      await user.type(input, 'a')
      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('PasswordField', () => {
    it('renders password input with label and handles onChange and onBlur', async () => {
      const user = userEvent.setup()
      const onBlur = vi.fn()
      const onChange = vi.fn()

      render(
        <PasswordField
          name="password"
          value="secret"
          onBlur={onBlur}
          onChange={onChange}
        />,
      )

      const input = screen.getByPlaceholderText('••••••••')
      expect(input).toBeDefined()
      input.focus()
      input.blur()
      expect(onBlur).toHaveBeenCalled()

      await user.type(input, 'b')
      expect(onChange).toHaveBeenCalled()
    })
  })
})
