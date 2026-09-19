import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SidebarSubscriptions } from '~/components/sidebar/SidebarSubscriptions'

describe('SidebarSubscriptions', () => {
  it('renders subscription section header and more button', () => {
    render(<SidebarSubscriptions />)
    expect(screen.getByText('登録チャンネル')).toBeDefined()
    expect(screen.getByText('さらに表示')).toBeDefined()
  })
})
