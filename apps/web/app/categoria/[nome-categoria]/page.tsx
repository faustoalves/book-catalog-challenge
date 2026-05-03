import BasicContainer from '@/components/ui/containers/basic-container/BasicContainer'
import HeaderContainer from '@/components/ui/containers/header-container/HeaderContainer'
import NavBar from '@/components/ui/navbar/Navbar'
import TitleDescription from '@/components/ui/titles/TitleDescription'
import Footer from '@/components/ui/footer/Footer'
import { BookApi } from '@book-catalog/shared'
import BookItem from '@/components/ui/books/book-item/BookItem'
import Link from 'next/link'
type CategoryPageProps = {
  params: Promise<{ 'nome-categoria': string }>
}

async function getCategoryData(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assuntos/${slug}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { 'nome-categoria': slug } = await params
  const data = await getCategoryData(slug)

  return (
    <main>
      <NavBar />
      <HeaderContainer>
        <TitleDescription type="medium" title={data.nome} description={data.descricao} />
      </HeaderContainer>
      <BasicContainer>
        <div className="flex grid grid-cols-2 flex-col gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.livros.map((livro: BookApi) => (
            <Link href={`/livro/${livro.slug}`} key={livro.slug}>
              <BookItem {...livro} />
            </Link>
          ))}
        </div>
      </BasicContainer>
      <Footer />
    </main>
  )
}
