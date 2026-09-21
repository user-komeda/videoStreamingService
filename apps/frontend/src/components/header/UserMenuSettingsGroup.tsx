import {
  ChevronRight,
  Globe,
  HelpCircle,
  Keyboard,
  Languages,
  MessageSquareWarning,
  Moon,
  PlusSquare,
  Receipt,
  Settings,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

const STUDIO_ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: PlusSquare, label: 'YouTube Studio' },
  { icon: Receipt, label: '購入とメンバーシップ' },
]

const PREF_ITEMS: { icon: LucideIcon; label: string; hasArrow?: boolean }[] = [
  { icon: ShieldCheck, label: 'YouTube でのデータ' },
  { icon: Moon, label: 'デザイン: デバイスのテーマ', hasArrow: true },
  { icon: Languages, label: '表示言語: 日本語', hasArrow: true },
  { icon: ShieldAlert, label: '制限付きモード: オフ', hasArrow: true },
  { icon: Globe, label: '場所: 日本', hasArrow: true },
  { icon: Keyboard, label: 'キーボード ショートカット' },
]

const HELP_ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: HelpCircle, label: 'ヘルプ' },
  { icon: MessageSquareWarning, label: 'フィードバックを送信' },
]

export const StudioAndDataGroup = () => (
  <>
    <div className="border-b py-2">
      {STUDIO_ITEMS.map(({ icon: Icon, label }) => (
        <button
          key={label}
          type="button"
          className="hover:bg-muted flex w-full items-center gap-3 px-4 py-2 text-left text-sm"
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
    <div className="border-b py-2">
      {PREF_ITEMS.map(({ icon: Icon, label, hasArrow }) => (
        <button
          key={label}
          type="button"
          className="hover:bg-muted flex w-full items-center justify-between px-4 py-2 text-left text-sm"
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </div>
          {hasArrow ? (
            <ChevronRight className="text-muted-foreground h-4 w-4" />
          ) : null}
        </button>
      ))}
    </div>
  </>
)

export const SettingsAndHelpGroup = () => (
  <>
    <div className="border-b py-2">
      <button
        type="button"
        className="hover:bg-muted flex w-full items-center gap-3 px-4 py-2 text-left text-sm"
      >
        <Settings className="h-5 w-5" />
        <span>設定</span>
      </button>
    </div>
    <div className="py-2">
      {HELP_ITEMS.map(({ icon: Icon, label }) => (
        <button
          key={label}
          type="button"
          className="hover:bg-muted flex w-full items-center gap-3 px-4 py-2 text-left text-sm"
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  </>
)
