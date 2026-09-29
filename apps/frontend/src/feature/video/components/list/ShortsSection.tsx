import { Flame } from 'lucide-react'

interface ShortsSectionProps {
  shorts: ShortItem[]
}
export interface ShortItem {
  id: string
  title: string
  thumbnailUrl: string
  views: string
}

const ShortCard = ({ short: _short }: { short: ShortItem }) => (
  <div className="group flex cursor-pointer flex-col gap-2">
    <div className="bg-muted relative aspect-[9/16] w-full overflow-hidden rounded-xl">
      {/*<img*/}
      {/*  src={short.thumbnailUrl}*/}
      {/*  alt={short.title}*/}
      {/*  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"*/}
      {/*/>*/}
    </div>
    <div>
      <h5 className="group-hover:text-primary line-clamp-2 text-sm leading-tight font-semibold">
        {'TODO'}
      </h5>
      <p className="text-muted-foreground mt-1 text-xs"> {'TODO'}</p>
    </div>
  </div>
)

export const ShortsSection = ({ shorts }: ShortsSectionProps) => (
  <section className="my-6 space-y-4 border-y py-6">
    <div className="flex items-center gap-2 px-1">
      <Flame className="h-5 w-5 text-red-500" />
      <h4 className="text-base font-bold">Shorts</h4>
    </div>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {shorts.map((short) => (
        <ShortCard key={short.id} short={short} />
      ))}
    </div>
  </section>
)
