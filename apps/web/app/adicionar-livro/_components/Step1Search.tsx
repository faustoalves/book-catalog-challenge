'use client'

import { useState } from 'react'
import { useAddBook } from '@/context/AddBookContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ChevronRightIcon } from 'lucide-react'

export function Step1Search() {
  const { startSearch, searchTitulo, searchAutor } = useAddBook()
  const [titulo, setTitulo] = useState(searchTitulo)
  const [autor, setAutor] = useState(searchAutor)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!titulo.trim()) return
    startSearch(titulo.trim(), autor.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="titulo">Nome do livro</Label>
        <Input
          id="titulo"
          placeholder="Informe o nome do livro"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="autor">Nome do autor</Label>
        <Input
          id="autor"
          placeholder="Informe o nome do autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        variant="solid"
        color="cream"
        icon={ChevronRightIcon}
        className="w-full"
      >
        Avançar
      </Button>
    </form>
  )
}
