'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeftIcon, PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { fetcher } from '@/lib/api'
import BookCover from '../book-cover/BookCover'

const DELETE_CONFIRMATION = 'deletar livro'

const bookSchema = z.object({
  titulo: z.string().min(1, 'Nome do livro é obrigatório'),
  autor: z.string().min(1, 'Nome do autor é obrigatório'),
  editora: z.string(),
  paginas: z.string().refine((v) => v === '' || /^\d+$/.test(v), 'Deve ser um número inteiro'),
  descricao: z.string(),
  imagemUrl: z
    .string()
    .refine((v) => v === '' || z.string().url().safeParse(v).success, 'URL inválida'),
  assuntoCodAs: z.string(),
  valor: z
    .string()
    .refine((v) => v === '' || /^\d+([.,]\d{1,2})?$/.test(v), 'Formato inválido: use "29,99"'),
})

type Assunto = { codAs: number; nome: string; slug: string }

type BookFormProps = {
  initialData: BookFormData
  mode: 'add' | 'edit'
  onSubmit: (data: BookFormData) => Promise<void>
  onBack?: () => void
  onDelete?: () => Promise<void>
}

export function BookForm({ initialData, mode, onSubmit, onBack, onDelete }: BookFormProps) {
  const [assuntosList, setAssuntosList] = useState<Assunto[]>([])
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetcher<Assunto[]>('/api/assuntos')
      .then(setAssuntosList)
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

  async function handleDelete() {
    if (!onDelete || deleteInput !== DELETE_CONFIRMATION) return
    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
      setDeleteOpen(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col gap-6 pb-8 lg:flex-row">
          <div className="flex basis-1/1 flex-row items-center justify-center gap-6 lg:basis-2/5">
            <BookCover imageUrl={initialData.imagemUrl} alt={initialData.titulo} size="large" />
          </div>
          <div className="flex basis-1/1 flex-col gap-6 lg:basis-3/5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="titulo">Nome do livro</Label>
              <Input id="titulo" placeholder="Informe o nome do livro" {...register('titulo')} />
              {errors.titulo && (
                <span className="body-14 text-red-500">{errors.titulo.message}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="autor">Nome do autor</Label>
                <Input id="autor" placeholder="Informe o nome do autor" {...register('autor')} />
                {errors.autor && (
                  <span className="body-14 text-red-500">{errors.autor.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="editora">Editora</Label>
                <Input id="editora" placeholder="Informe a editora" {...register('editora')} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Categoria</Label>
              <Controller
                name="assuntoCodAs"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {assuntosList.map((assunto) => (
                        <SelectItem key={assunto.codAs} value={String(assunto.codAs)}>
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
                {errors.valor && (
                  <span className="body-14 text-red-500">{errors.valor.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="paginas">Páginas</Label>
                <Input id="paginas" type="number" placeholder="123" {...register('paginas')} />
                {errors.paginas && (
                  <span className="body-14 text-red-500">{errors.paginas.message}</span>
                )}
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
          </div>
        </div>
        <div className="flex flex-col-reverse items-center justify-between gap-4 lg:flex-row">
          {onBack && (
            <Button
              type="button"
              variant="outline"
              color="cream"
              icon={ChevronLeftIcon}
              onClick={onBack}
              className="w-full lg:w-auto"
            >
              Voltar
            </Button>
          )}
          <div className="flex w-full flex-col-reverse gap-4 lg:w-auto lg:flex-row">
            {mode === 'edit' && onDelete && (
              <Button
                type="button"
                variant="solid"
                color="brown"
                icon={TrashIcon}
                onClick={() => {
                  setDeleteInput('')
                  setDeleteOpen(true)
                }}
                className="w-full lg:w-auto"
              >
                Excluir
              </Button>
            )}
            <Button
              type="submit"
              variant="solid"
              color="cream"
              icon={mode === 'add' ? PlusIcon : PencilIcon}
              disabled={isSubmitting}
              className="ml-auto w-full lg:w-auto"
            >
              {mode === 'add' ? 'Confirmar e adicionar' : 'Salvar alterações'}
            </Button>
          </div>
        </div>
      </form>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent showCloseButton={false} className="bg-cream-100 border-cream-700 border">
          <DialogHeader>
            <DialogTitle className="title-24! font-playfair text-cream-900">
              Excluir livro
            </DialogTitle>
            <DialogDescription className="body-16 text-cream-900">
              Tem certeza que deseja excluir <strong>{initialData.titulo}</strong>? Esta ação é
              permanente e não pode ser desfeita. Todos os dados do livro serão removidos.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <Label htmlFor="delete-confirm" className="body-14 text-cream-900">
              Para confirmar, digite <strong>{DELETE_CONFIRMATION}</strong> abaixo:
            </Label>
            <Input
              id="delete-confirm"
              placeholder={DELETE_CONFIRMATION}
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              color="cream"
              icon={ChevronLeftIcon}
              onClick={() => setDeleteOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="solid"
              color="brown"
              icon={TrashIcon}
              disabled={deleteInput !== DELETE_CONFIRMATION || isDeleting}
              onClick={handleDelete}
            >
              Confirmar exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
