import { integer, numeric, pgTable, serial, text } from 'drizzle-orm/pg-core'

export const livros = pgTable('livros', {
  codl: serial('codl').primaryKey(),
  titulo: text('titulo').notNull(),
  editora: text('editora'),
  edicao: integer('edicao'),
  anoPublicacao: integer('ano_publicacao'),
  valor: numeric('valor', { precision: 10, scale: 2 }).notNull(),
  imagemUrl: text('imagem_url'),
  paginas: integer('paginas'),
})

export const autores = pgTable('autores', {
  codAu: serial('cod_au').primaryKey(),
  nome: text('nome').notNull(),
})

export const assuntos = pgTable('assuntos', {
  codAs: serial('cod_as').primaryKey(),
  nome: text('nome').notNull(),
  slug: text('slug').notNull().unique(),
  descricao: text('descricao'),
})

export const livroAutor = pgTable('livro_autor', {
  livroCodl: integer('livro_codl')
    .notNull()
    .references(() => livros.codl),
  autorCodAu: integer('autor_cod_au')
    .notNull()
    .references(() => autores.codAu),
})

export const livroAssunto = pgTable('livro_assunto', {
  livroCodl: integer('livro_codl')
    .notNull()
    .references(() => livros.codl),
  assuntoCodAs: integer('assunto_cod_as')
    .notNull()
    .references(() => assuntos.codAs),
})

export type LivroSelect = typeof livros.$inferSelect
export type LivroInsert = typeof livros.$inferInsert
export type AutorSelect = typeof autores.$inferSelect
export type AssuntoSelect = typeof assuntos.$inferSelect
