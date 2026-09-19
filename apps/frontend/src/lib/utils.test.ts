import { describe, expect, it } from 'vitest'

import { cn } from '~/lib/utils'

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('handles conditional class names', () => {
    const isActive = true
    const isHidden = false
    expect(
      cn('base-class', isActive && 'is-active', isHidden && 'is-hidden'),
    ).toBe('base-class is-active')
  })

  it('merges tailwind classes and resolves conflicts', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })
})
