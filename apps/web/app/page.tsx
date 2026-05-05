import BooksSlider from '@/components/ui/books/books-slider/BooksSlider'
import { BookSlider } from '@book-catalog/shared'
import Footer from '@/components/ui/footer/Footer'
import HeaderContainer from '@/components/ui/containers/header-container/HeaderContainer'
import NavBar from '@/components/ui/navbar/Navbar'
import TitleDescription from '@/components/ui/titles/TitleDescription'
import Image from 'next/image'

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
      <HeaderContainer className="px-0">
        <div className="lg:px-auto mx-auto flex w-full flex-col items-center justify-center gap-6 px-0 md:flex-row">
          <TitleDescription
            type="large"
            title="Organize sua leitura, expanda seu mundo"
            description="Monte sua lista de leituras, acompanhe o que já leu e encontre sua próxima grande história, tudo em um só lugar."
            className="basis-1/1 lg:px-auto px-4 lg:basis-1/2"
          />
          <Image
            src="/img_hero_mobile.png"
            alt="Home Hero"
            width={390}
            height={365}
            className="ml-auto block md:hidden"
          />
          <Image
            src="/img_hero_desktop.png"
            alt="Home Hero"
            width={600}
            height={595}
            className="hidden md:block"
          />
        </div>
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
