import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RelatedVideoFilters } from '~/feature/video/components/related/RelatedVideoFilters'

describe('RelatedVideoFilters', () => {
  it('renders category buttons and handles selection', () => {
    const onSelectCategory = vi.fn()
    const categories = ['すべて', '音楽', 'ゲーム']

    render(
      <RelatedVideoFilters
        categories={categories}
        selectedCategory="すべて"
        onSelectCategory={onSelectCategory}
      />,
    )

    expect(screen.getByText('すべて')).toBeDefined()
    expect(screen.getByText('音楽')).toBeDefined()
    expect(screen.getByText('ゲーム')).toBeDefined()

    fireEvent.click(screen.getByText('音楽'))
    expect(onSelectCategory).toHaveBeenCalledWith('音楽')
  })
})
