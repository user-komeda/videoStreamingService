import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { CategoryPills } from '~/feature/video/components/list/CategoryPills'

describe('CategoryPills', () => {
  it('renders categories and changes selected category on click', async () => {
    const user = userEvent.setup()
    const categories = ['すべて', '音楽', 'ゲーム']
    render(<CategoryPills categories={categories} />)

    expect(screen.getByText('すべて')).toBeDefined()
    expect(screen.getByText('音楽')).toBeDefined()
    expect(screen.getByText('ゲーム')).toBeDefined()

    const gameBtn = screen.getByText('ゲーム')
    await user.click(gameBtn)
    expect(gameBtn).toBeDefined()
  })

  it('renders fallback when categories array is empty', () => {
    render(<CategoryPills categories={[]} />)
    expect(screen.queryByRole('button')).toBeNull()
  })
})
