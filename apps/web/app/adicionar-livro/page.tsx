'use client'

import { useAddBook } from '@/context/AddBookContext'
import { Step1Search } from './_components/Step1Search'
import { Step2Results } from './_components/Step2Results'
import { Step3Form } from './_components/Step3Form'

const STEP_TITLES = {
  1: {
    title: 'Qual livro você quer adicionar?',
    description: 'Digite o título e o autor para começarmos a buscar o livro certo para você.',
  },
  2: {
    title: 'Escolha o livro',
    description: 'Selecione o livro que deseja adicionar à sua lista.',
  },
  3: {
    title: 'Confirme e adicione à sua lista',
    description: 'Revise as informações do livro, ajuste o que precisar e finalize a inclusão.',
  },
}

const EMPTY_TITLE = 'Nenhum resultado encontrado'
const EMPTY_DESCRIPTION =
  'Não encontramos livros com esse título ou autor. Tente verificar a ortografia ou buscar com termos diferentes.'

export default function AddBookPage() {
  const { step, searchResults, isSearching } = useAddBook()

  const isEmptyResults = step === 2 && !isSearching && searchResults.length === 0
  const { title, description } = isEmptyResults
    ? { title: EMPTY_TITLE, description: EMPTY_DESCRIPTION }
    : STEP_TITLES[step]

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="title-40 text-cream-900">{title}</h1>
            <p className="body-18 text-cream-800 mt-2">{description}</p>
          </div>
          <StepIndicator current={step} />
        </div>

        {step === 1 && <Step1Search />}
        {step === 2 && <Step2Results />}
        {step === 3 && <Step3Form />}
      </div>
    </main>
  )
}

function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-2">
      {([1, 2, 3] as const).map((n) => (
        <div
          key={n}
          className={`btn-label flex size-8 items-center justify-center rounded-full transition-colors ${
            n === current
              ? 'bg-green-700 text-white'
              : n < current
                ? 'bg-cream-600 text-white'
                : 'bg-cream-300 text-cream-700'
          }`}
        >
          {n}
        </div>
      ))}
    </div>
  )
}
