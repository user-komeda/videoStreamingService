import { useState } from 'react'

import { Button } from '~/components/ui/button'

interface CategoryPillsProps {
  categories: string[]
}

export const CategoryPills = ({ categories }: CategoryPillsProps) => {
  const [selected, setSelected] = useState<string>(categories[0] ?? 'すべて')

  return (
    <div className="bg-background/95 no-scrollbar sticky top-14 z-40 flex gap-2 overflow-x-auto border-b px-4 py-3 backdrop-blur">
      {categories.map((category) => {
        const isSelected = selected === category
        return (
          <Button
            key={category}
            variant={isSelected ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelected(category)}
            className="shrink-0 rounded-lg px-3 text-xs font-medium"
          >
            {category}
          </Button>
        )
      })}
    </div>
  )
}
