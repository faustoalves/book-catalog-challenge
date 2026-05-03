'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeftIcon, PlusIcon, PencilIcon } from 'lucide-react'

import { type BookFormData } from '@/context/AddBookContext'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fetcher } from '@/lib/api'

const bookSchema = z.object({
  titulo: z.string().min(1, 'Nome do livro é obrigatório'),
  autor: z.string().min(1, 'Nome do autor é obrigatório'),
  editora: z.string(),
  paginas: z.string().refine((v) => v === '' || /^\d+$/.test(v), 'Deve ser um número inteiro'),
  descricao: z.string(),
  imagemUrl: z
    .string()
    .refine((v) => v === '' || z.string().url().safeParse(v).success, 'URL inválida'),
  categoria: z.string(),
  valor: z
    .string()
    .refine((v) => v === '' || /^\d+([.,]\d{1,2})?$/.test(v), 'Formato inválido: use "29,99"'),
})

type Assunto = { nome: string; slug: string }

type BookFormProps = {
  initialData: BookFormData
  mode: 'add' | 'edit'
  onSubmit: (data: BookFormData) => Promise<void>
  onBack?: () => void
}

export function BookForm({ initialData, mode, onSubmit, onBack }: BookFormProps) {
  const [assuntos, setAssuntos] = useState<Assunto[]>([])

  useEffect(() => {
    fetcher<Assunto[]>('/api/assuntos')
      .then(setAssuntos)
      .catch(() => {})
  }, [])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="titulo">Nome do livro</Label>
        <Input id="titulo" placeholder="Informe o nome do livro" {...register('titulo')} />
        {errors.titulo && <span className="body-12 text-red-500">{errors.titulo.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="autor">Nome do autor</Label>
          <Input id="autor" placeholder="Informe o nome do autor" {...register('autor')} />
          {errors.autor && <span className="body-12 text-red-500">{errors.autor.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="editora">Editora</Label>
          <Input id="editora" placeholder="Informe a editora" {...register('editora')} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Categoria</Label>
        <Controller
          name="categoria"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha a categoria" />
              </SelectTrigger>
              <SelectContent>
                {assuntos.map((assunto) => (
                  <SelectItem key={assunto.slug} value={assunto.nome}>
                    {assunto.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="valor">Preço sugerido</Label>
          <Input id="valor" placeholder="00,00" {...register('valor')} />
          {errors.valor && <span className="body-12 text-red-500">{errors.valor.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="paginas">Páginas</Label>
          <Input id="paginas" type="number" placeholder="123" {...register('paginas')} />
          {errors.paginas && <span className="body-12 text-red-500">{errors.paginas.message}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          placeholder="Escreva a descrição do livro"
          rows={6}
          {...register('descricao')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="imagemUrl">URL da imagem</Label>
        <Input id="imagemUrl" placeholder="https://..." {...register('imagemUrl')} />
        {errors.imagemUrl && (
          <span className="body-12 text-red-500">{errors.imagemUrl.message}</span>
        )}
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
