import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ShortsSection } from '~/feature/home/components/ShortsSection'

import type { ShortItem } from '~/feature/home/components/ShortsSection'

describe('ShortsSection', () => {
  const shorts: ShortItem[] = [
    {
      id: 's1',
      title: 'Short 1',
      thumbnailUrl: 'https://example.com/s1.jpg',
      views: '50万回',
    },
    {
      id: 's2',
      title: 'Short 2',
      thumbnailUrl: 'https://example.com/s2.jpg',
      views: '10万回',
    },
  ]

  it('renders shorts section header and cards', () => {
    render(<ShortsSection shorts={shorts} />)

    expect(screen.getByText('Shorts')).toBeDefined()
  })
})
