import BooksSlider from '@/components/ui/books/books-slider/BooksSlider'
import { BookSlider } from '@book-catalog/shared'
import Footer from '@/components/ui/footer/Footer'
import HeaderContainer from '@/components/ui/containers/header-container/HeaderContainer'
import NavBar from '@/components/ui/navbar/Navbar'
import TitleDescription from '@/components/ui/titles/TitleDescription'

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
      <NavBar />
      <HeaderContainer>
        <TitleDescription type="large" title="Livros" description="Descrição dos livros" />
      </HeaderContainer>
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
      <Footer />
    </main>
  )
}
