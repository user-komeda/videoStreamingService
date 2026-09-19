import React from 'react'

import { render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  DescriptionFormField,
  SubmitFormField,
  TitleFormField,
  VisibilityFormField,
} from '~/feature/upload/components/UploadFormInputs'
import { useUploadForm } from '~/feature/upload/hooks/useUploadForm'

describe('UploadFormInputs', () => {
  it('renders all form field inputs correctly', () => {
    const { result } = renderHook(() => useUploadForm())
    const form = result.current

    render(
      <form>
        <TitleFormField form={form} />
        <DescriptionFormField form={form} />
        <VisibilityFormField form={form} />
        <SubmitFormField form={form} />
      </form>,
    )

    expect(screen.getByPlaceholderText('動画のタイトルを入力')).toBeDefined()
    expect(screen.getByPlaceholderText('動画の説明を入力')).toBeDefined()
    expect(screen.getByRole('combobox')).toBeDefined()
    expect(screen.getByRole('button', { name: '次へ進む' })).toBeDefined()
  })

  it('renders submitting label and handles undefined value in description', () => {
    const mockForm = {
      Field: ({
        children,
        name,
      }: {
        children: (field: unknown) => React.ReactNode
        name: string
      }) =>
        children({
          name,
          state: {
            value: undefined,
            meta: { isTouched: true, errors: [], isValidating: false },
          },
          handleBlur: vi.fn(),
          handleChange: vi.fn(),
        }),
      Subscribe: ({
        children,
      }: {
        children: (val: [boolean, boolean, string]) => React.ReactNode
      }) => children([true, true, 'Test Title']),
    } as unknown as Parameters<typeof SubmitFormField>[0]['form']

    render(
      <form>
        <DescriptionFormField form={mockForm} />
        <SubmitFormField form={mockForm} />
      </form>,
    )

    expect(screen.getByRole('button', { name: '保存中...' })).toBeDefined()
  })
})
