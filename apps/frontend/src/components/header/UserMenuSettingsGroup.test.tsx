import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  SettingsAndHelpGroup,
  StudioAndDataGroup,
} from '~/components/header/UserMenuSettingsGroup'

describe('UserMenuSettingsGroup', () => {
  it('renders StudioAndDataGroup items correctly', () => {
    render(<StudioAndDataGroup />)
    expect(screen.getByText('YouTube Studio')).toBeDefined()
    expect(screen.getByText('購入とメンバーシップ')).toBeDefined()
    expect(screen.getByText('YouTube でのデータ')).toBeDefined()
    expect(screen.getByText('デザイン: デバイスのテーマ')).toBeDefined()
    expect(screen.getByText('キーボード ショートカット')).toBeDefined()
  })

  it('renders SettingsAndHelpGroup items correctly', () => {
    render(<SettingsAndHelpGroup />)
    expect(screen.getByText('設定')).toBeDefined()
    expect(screen.getByText('ヘルプ')).toBeDefined()
    expect(screen.getByText('フィードバックを送信')).toBeDefined()
  })
})
