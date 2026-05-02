type EditBookPageProps = {
  params: Promise<{ 'slug-do-livro': string }>
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { 'slug-do-livro': slug } = await params

  return (
    <main>
      <h1>{slug}</h1>
    </main>
  )
}
