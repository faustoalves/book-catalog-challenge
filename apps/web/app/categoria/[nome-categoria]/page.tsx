type CategoryPageProps = {
  params: Promise<{ 'nome-categoria': string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { 'nome-categoria': category } = await params

  return (
    <main>
      <h1>{category}</h1>
    </main>
  )
}
