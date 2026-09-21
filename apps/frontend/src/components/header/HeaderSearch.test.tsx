import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HeaderSearch } from '~/components/header/HeaderSearch'

describe('HeaderSearch', () => {
  it('renders search input and action buttons', () => {
    render(<HeaderSearch />)

    expect(screen.getByPlaceholderText('検索')).toBeDefined()
  })
})
