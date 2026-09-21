import { ChevronDown } from 'lucide-react'

import { Button } from '~/components/ui/button'

export const SidebarSubscriptions = () => {
  return (
    <div className="space-y-1">
      <div className="text-muted-foreground px-3 py-1 text-xs font-semibold">
        登録チャンネル
      </div>
      {/*{MOCK_SUBSCRIPTIONS.map((channel) => (*/}
      {/*  <Button*/}
      {/*    key={channel.id}*/}
      {/*    variant="ghost"*/}
      {/*    className="h-10 w-full justify-start gap-3 px-3 py-1.5 font-normal"*/}
      {/*  >*/}
      {/*    <img*/}
      {/*      src={channel.avatarUrl}*/}
      {/*      alt={channel.name}*/}
      {/*      className="h-6 w-6 shrink-0 rounded-full object-cover"*/}
      {/*    />*/}
      {/*    <span className="flex-1 truncate text-left text-sm">*/}
      {/*      {channel.name}*/}
      {/*    </span>*/}
      {/*    {channel.hasNewVideo && (*/}
      {/*      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />*/}
      {/*    )}*/}
      {/*  </Button>*/}
      {/*))}*/}
      <Button
        variant="ghost"
        className="text-muted-foreground h-10 w-full justify-start gap-3 px-3 py-1.5 font-normal"
      >
        <ChevronDown className="h-4 w-4 shrink-0" />
        <span className="text-sm">さらに表示</span>
      </Button>
    </div>
  )
}
