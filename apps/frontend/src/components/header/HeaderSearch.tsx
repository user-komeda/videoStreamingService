import { Mic, Search } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export const HeaderSearch = () => (
  <div className="hidden max-w-2xl flex-1 items-center justify-center px-4 sm:flex">
    <div className="flex w-full items-center">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="検索"
          className="min-h-[36px] w-full min-w-[120px] rounded-r-none border-r-0 focus-visible:ring-0"
        />
      </div>
      <Button
        variant="secondary"
        className="min-h-[36px] min-w-[48px] rounded-l-none border border-l-0 px-5"
        aria-label="検索"
      >
        <Search className="text-muted-foreground h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="ml-2 min-h-[36px] min-w-[36px] rounded-full"
        aria-label="音声検索"
      >
        <Mic className="h-4 w-4" />
      </Button>
    </div>
  </div>
)
