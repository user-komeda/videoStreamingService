import { Button } from '~/components/ui/button'

interface RelatedVideoFiltersProps {
  categories?: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export const RelatedVideoFilters = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
}: RelatedVideoFiltersProps) => {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => {
        const isSelected = selectedCategory === category
        return (
          <Button
            key={category}
            variant={isSelected ? 'default' : 'secondary'}
            size="sm"
            onClick={() => onSelectCategory(category)}
            className="shrink-0 rounded-full px-3 text-xs font-medium"
          >
            {category}
          </Button>
        )
      })}
    </div>
  )
}
