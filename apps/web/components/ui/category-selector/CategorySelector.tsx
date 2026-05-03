import { ASSUNTOS_LIST } from '@/lib/utils'
import { CategorySelectorClient } from './CategorySelectorClient'

const CategorySelector = async () => {
  return <CategorySelectorClient assuntos={ASSUNTOS_LIST} />
}

export default CategorySelector
