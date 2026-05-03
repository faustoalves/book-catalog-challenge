'use client'

import React, { Suspense, useState } from 'react'
import Logo from '@/components/ui/elements/logo/Logo'
import { Button } from '../button'
import { ChevronRightIcon, Menu, Plus, SearchIcon, XIcon } from 'lucide-react'
import { InputGroup, InputGroupInput, InputGroupSuffix } from '../input-group'
import CategorySelector from '../category-selector/CategorySelector'
import { Sheet, SheetContent } from '../sheet'
import Link from 'next/link'
import { ASSUNTOS_LIST } from '@/lib/utils'

const NavBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 w-full bg-transparent/50 px-4 py-4 backdrop-blur-xl md:px-6">
      <div className="container mx-auto flex max-w-[1280px] items-center justify-between gap-2">
        <Link href="/">
          <Logo className="h-6 w-auto shrink-0 lg:h-[30px]" />
        </Link>
        <div className="hidden w-full max-w-sm items-center lg:block xl:max-w-lg">
          <InputGroup className="w-full">
            <InputGroupInput placeholder="Busque por titulo do livro ou por autor" />
            <InputGroupSuffix>
              <SearchIcon className="text-cream-700 size-4" />
            </InputGroupSuffix>
          </InputGroup>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <Suspense>
            <CategorySelector />
          </Suspense>
          <Link href="/adicionar-livro">
            <Button color="cream" variant="solid" icon={Plus}>
              Adicionar livro
            </Button>
          </Link>
        </div>
        <button
          className="flex items-center lg:hidden"
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="text-brown-700 size-6" />
        </button>
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="max-h-100vh flex w-[310px] flex-col bg-white p-2"
        >
          <div className="border-cream-400 flex items-center justify-between border-b px-2 py-2">
            <Logo className="h-6 w-auto" />
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-cream-600 hover:bg-cream-100 hover:text-cream-900 flex size-8 items-center justify-center rounded-full transition-colors"
              aria-label="Fechar menu"
            >
              <XIcon className="size-5" />
            </button>
          </div>

          <div className="flex h-[calc(100vh-200px)] flex-col justify-between gap-1 p-1">
            <InputGroup className="w-full">
              <InputGroupInput placeholder="Busque por titulo do livro ou por autor" />
              <InputGroupSuffix>
                <SearchIcon className="text-cream-700 size-4" />
              </InputGroupSuffix>
            </InputGroup>
            <div className="border-cream-400 border-p my-4 flex max-h-[90%] flex-col gap-2 border-y py-4">
              <p className="title-24 font-playfair text-brown-700">Categorias</p>
              <div className="divide-cream-400 flex flex-col divide-y overflow-y-auto">
                {ASSUNTOS_LIST.map((assunto) => (
                  <Link
                    href={`/categoria/${assunto.slug}`}
                    key={assunto.slug}
                    className="flex flex-row items-center gap-2 py-2"
                  >
                    <ChevronRightIcon className="text-brown-700 size-2" />
                    <p className="body-16 text-brown-700">{assunto.nome}</p>
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/adicionar-livro" onClick={() => setDrawerOpen(false)}>
              <Button color="cream" variant="solid" icon={Plus} className="w-full">
                Adicionar livro
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}

export default NavBar
