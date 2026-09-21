import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { UploadProgress } from '~/feature/upload/components/uploadProgress'

describe('UploadProgress', () => {
  it('renders progress percentage', () => {
    render(<UploadProgress pct={75} />)
    expect(screen.getByText('75%')).toBeDefined()
  })
})
