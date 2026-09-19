import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { VideoCommentsHeader } from '~/feature/video/components/comments/VideoCommentsHeader'

describe('VideoCommentsHeader', () => {
  it('renders comments count and sort button', () => {
    render(<VideoCommentsHeader totalCount={42} />)

    expect(screen.getByText('コメント 42件')).toBeDefined()
    expect(screen.getByText('並べ替え')).toBeDefined()
  })
})
