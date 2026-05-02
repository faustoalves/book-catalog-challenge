type BookPageProps = {
  params: Promise<{ 'slug-do-livro': string }>
}

export default async function BookPage({ params }: BookPageProps) {
  const { 'slug-do-livro': slug } = await params

  return (
    <main>
      <h1>{slug}</h1>
    </main>
  )
}
