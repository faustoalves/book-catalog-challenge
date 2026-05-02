import { CategorySelectorClient } from './CategorySelectorClient'

type Assunto = { nome: string; slug: string }

const CategorySelector = async () => {
  let assuntos: Assunto[] = []

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assuntos`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) assuntos = await res.json()
  } catch {
    // API indisponível — renderiza sem categorias
  }

  return <CategorySelectorClient assuntos={assuntos} />
}

export default CategorySelector
