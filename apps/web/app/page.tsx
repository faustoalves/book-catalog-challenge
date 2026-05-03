import BooksSlider from '@/components/ui/books/books-slider/BooksSlider'
import { BookSlider } from '@book-catalog/shared'

async function getHomeData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export default async function HomePage() {
  const data = await getHomeData()

  return (
    <main className="h-full w-full">
      {data.map((item: BookSlider) => (
        <BooksSlider
          key={item.slug}
          nome={item.nome}
          descricao={item.descricao}
          slug={item.slug}
          livros={item.livros}
          count={item.count}
        />
      ))}
    </main>
  )
}
