'use client'
import Link from 'next/link'
import {
  NavSelect,
  NavSelectContent,
  NavSelectItem,
  NavSelectTrigger,
  NavSelectValue,
} from '../nav-select'

type Assunto = { nome: string; slug: string }

export function CategorySelectorClient({ assuntos }: { assuntos: Assunto[] }) {
  return (
    <NavSelect>
      <NavSelectTrigger>
        <NavSelectValue placeholder="Categorias" />
      </NavSelectTrigger>
      <NavSelectContent listClassName="max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-green-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-green-500">
        {assuntos.map((assunto) => (
          <Link href={`/categoria/${assunto.slug}`} key={assunto.slug}>
            <NavSelectItem key={assunto.slug} value={assunto.slug}>
              {assunto.nome}
            </NavSelectItem>
          </Link>
        ))}
      </NavSelectContent>
    </NavSelect>
  )
}
