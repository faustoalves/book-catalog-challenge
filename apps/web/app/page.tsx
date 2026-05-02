import BookCover from '@/components/ui/books/book-cover/BookCover'
import { Button } from '@/components/ui/button'
import HeaderContainer from '@/components/ui/containers/header-container/HeaderContainer'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupInput,
  InputGroupPrefix,
  InputGroupSuffix,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import NavBar from '@/components/ui/navbar/Navbar'
import { Textarea } from '@/components/ui/textarea'
import TitleDescription from '@/components/ui/titles/TitleDescription'
import { ChevronRightIcon, Search, SearchIcon, X } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="h-full w-full">
      <NavBar />
      <HeaderContainer>
        <TitleDescription
          type="large"
          title="Organize sua leitura, expanda seu mundo"
          description="Monte sua lista de leituras, acompanhe o que já leu e encontre sua próxima grande história, tudo em um só lugar."
        />
        <Button color="cream" variant="solid" icon={ChevronRightIcon} />

        <Textarea placeholder="Digite o título do livro" className="w-1/4" rows={10} />
        {/* 
        <div className="bg-cream-300 flex w-1/4 items-center justify-center p-4">
          <BookCover
            imageUrl="https://m.media-amazon.com/images/I/513Xm7DXw0L._SY445_SX342_QL70_ML2_.jpg"
            alt="Improvisado"
          />
        </div> */}
      </HeaderContainer>
    </main>
  )
}
