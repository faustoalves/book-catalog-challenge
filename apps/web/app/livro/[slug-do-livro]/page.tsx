import BookCover from '@/components/ui/books/book-cover/BookCover'
import BooksSlider from '@/components/ui/books/books-slider/BooksSlider'
import { Button } from '@/components/ui/button'
import HeaderContainer from '@/components/ui/containers/header-container/HeaderContainer'
import NavBar from '@/components/ui/navbar/Navbar'
import TitleDescription from '@/components/ui/titles/TitleDescription'
import { BookmarkIcon, SettingsIcon, Share2 } from 'lucide-react'
import Link from 'next/link'
type BookPageProps = {
  params: Promise<{ 'slug-do-livro': string }>
}

async function getBookData(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/livros/${slug}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export default async function BookPage({ params }: BookPageProps) {
  const { 'slug-do-livro': slug } = await params
  const data = await getBookData(slug)

  return (
    <main>
      <NavBar />
      <HeaderContainer>
        <div className="relative mx-auto flex flex-col gap-12 lg:flex-row">
          <div className="top-[172px] flex w-full flex-col gap-20 self-start lg:sticky lg:w-auto lg:basis-3/7">
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <BookCover
                imageUrl={
                  data.imagemUrl ??
                  'https://books.google.com/books/content?id=lxlGzwEACAAJ&printsec=frontcover&img=1&zoom=3&source=gbs_api'
                }
                alt={data.titulo}
                size="large"
              />
            </div>
          </div>
          <div className="flex basis-4/7 flex-col gap-2">
            <div className="flex h-auto w-full flex-col items-center justify-center gap-2 lg:h-[500px]">
              <div className="flex w-full flex-row gap-2">
                <Link href={`/editar-livro/${data.slug}`}>
                  <Button variant="solid" color="cream" icon={SettingsIcon}>
                    Editar Livro
                  </Button>
                </Link>
                <Button variant="outline" color="brown" icon={BookmarkIcon} className="ml-auto" />
                <Button variant="solid" color="brown" icon={Share2} />
              </div>
              <TitleDescription
                type="large"
                title={data.titulo}
                description={data.autores.join(', ')}
                className="w-full flex-1 items-start justify-center"
              />
            </div>
            <p className="body-16 h-96 text-gray-700">test</p>
          </div>
        </div>
      </HeaderContainer>
      <BooksSlider
        nome="Veja também"
        descricao="Se você gostou desse livro, pode gostar desses também"
        slug={data.categoriaRelacionada.slug}
        livros={data.categoriaRelacionada.livros}
        count={data.categoriaRelacionada.count}
      />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  )
}
