import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UploadDropArea } from '~/feature/upload/components/upload_drop_area'

describe('UploadDropArea', () => {
  it('renders drop area with instructions and input props', () => {
    const getRootProps = vi.fn().mockReturnValue({ 'data-testid': 'root-drop' })
    const getInputProps = vi
      .fn()
      .mockReturnValue({ 'data-testid': 'input-file' })

    render(
      <UploadDropArea
        getRootProps={getRootProps}
        getInputProps={getInputProps}
      />,
    )

    expect(screen.getByTestId('root-drop')).toBeDefined()
    expect(screen.getByTestId('input-file')).toBeDefined()
    expect(screen.getByText('ここにドラッグ＆ドロップ')).toBeDefined()
    expect(screen.getByText('ファイルを選択')).toBeDefined()
  })
})
