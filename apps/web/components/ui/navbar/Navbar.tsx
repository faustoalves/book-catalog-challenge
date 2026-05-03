import React from 'react'
import Logo from '@/components/ui/elements/logo/Logo'
import { Button } from '../button'
import { Plus, SearchIcon } from 'lucide-react'
import { InputGroup, InputGroupInput, InputGroupSuffix } from '../input-group'
import CategorySelector from '../category-selector/CategorySelector'
import Link from 'next/link'

const NavBar: React.FC = () => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 w-full bg-transparent/50 px-4 py-4 backdrop-blur-xl md:px-6">
      <div className="container mx-auto flex max-w-[1280px] items-center justify-between gap-2">
        <Logo className="h-6 w-auto shrink-0 lg:h-[30px]" />
        <div className="hidden w-full max-w-sm items-center lg:block xl:max-w-lg">
          <InputGroup className="w-full">
            <InputGroupInput placeholder="Busque por titulo do livro ou por autor" />
            <InputGroupSuffix>
              <SearchIcon className="text-cream-700 size-4" />
            </InputGroupSuffix>
          </InputGroup>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <CategorySelector />
          <Link href="/adicionar-livro">
            <Button color="cream" variant="solid" icon={Plus}>
              Adicionar livro
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
