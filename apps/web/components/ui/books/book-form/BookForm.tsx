'use client'

import { useState } from 'react'
import { type BookFormData } from '@/context/AddBookContext'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, PlusIcon, PencilIcon } from 'lucide-react'

type BookFormProps = {
  initialData: BookFormData
  mode: 'add' | 'edit'
  onSubmit: (data: BookFormData) => Promise<void>
  onBack?: () => void
}

export function BookForm({ initialData, mode, onSubmit, onBack }: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(field: keyof BookFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="titulo">Nome do livro</Label>
        <Input
          id="titulo"
          placeholder="Informe o nome do livro"
          value={formData.titulo}
          onChange={(e) => handleChange('titulo', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="autor">Nome do autor</Label>
          <Input
            id="autor"
            placeholder="Informe o nome do autor"
            value={formData.autor}
            onChange={(e) => handleChange('autor', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="editora">Editora</Label>
          <Input
            id="editora"
            placeholder="Informe a editora"
            value={formData.editora}
            onChange={(e) => handleChange('editora', e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="categoria">Categoria</Label>
        <Input
          id="categoria"
          placeholder="Escolha a categoria"
          value={formData.categoria}
          onChange={(e) => handleChange('categoria', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="valor">Preço sugerido</Label>
          <Input
            id="valor"
            placeholder="00,00"
            value={formData.valor}
            onChange={(e) => handleChange('valor', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="paginas">Páginas</Label>
          <Input
            id="paginas"
            type="number"
            placeholder="123"
            value={formData.paginas}
            onChange={(e) => handleChange('paginas', e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          placeholder="Escreva a descrição do livro"
          value={formData.descricao}
          onChange={(e) => handleChange('descricao', e.target.value)}
          rows={6}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="imagemUrl">URL da imagem</Label>
        <Input
          id="imagemUrl"
          placeholder="https://..."
          value={formData.imagemUrl}
          onChange={(e) => handleChange('imagemUrl', e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            color="cream"
            icon={ChevronLeftIcon}
            onClick={onBack}
          >
            Refazer pesquisa
          </Button>
        )}
        <Button
          type="submit"
          variant="solid"
          color="cream"
          icon={mode === 'add' ? PlusIcon : PencilIcon}
          disabled={isSubmitting}
          className="ml-auto"
        >
          {mode === 'add' ? 'Confirmar e adicionar' : 'Salvar alterações'}
        </Button>
      </div>
    </form>
  )
}
