import { date, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const books = pgTable('books', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  isbn: text('isbn').unique(),
  description: text('description'),
  coverUrl: text('cover_url'),
  genre: text('genre'),
  publishedAt: date('published_at'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type BookSelect = typeof books.$inferSelect
export type BookInsert = typeof books.$inferInsert
