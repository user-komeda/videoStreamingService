import { describe, expect, it } from 'vitest'

import { formatDuration } from '~/util/format'

describe('formatDuration', () => {
  it('returns 0:00 for nil, NaN, 0 or negative values', () => {
    expect(formatDuration(undefined)).toBe('0:00')
    expect(formatDuration(null)).toBe('0:00')
    expect(formatDuration(NaN)).toBe('0:00')
    expect(formatDuration(0)).toBe('0:00')
    expect(formatDuration(-100)).toBe('0:00')
  })

  it('formats seconds and minutes correctly', () => {
    expect(formatDuration(5000)).toBe('0:05')
    expect(formatDuration(65000)).toBe('1:05')
    expect(formatDuration(185000)).toBe('3:05')
    expect(formatDuration(599000)).toBe('9:59')
  })

  it('formats hours correctly', () => {
    expect(formatDuration(3600000)).toBe('1:00:00')
    expect(formatDuration(3665000)).toBe('1:01:05')
    expect(formatDuration(7325000)).toBe('2:02:05')
  })
})
