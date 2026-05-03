import Link from 'next/link'
import Logo from '../elements/logo/Logo'

const Footer = () => {
  return (
    <div className="bg-cream-300 lg:py-18 border-cream-400 flex flex-col items-center justify-center border-t py-12">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-8 px-8 lg:flex-row">
        <Link href="/">
          <Logo className="h-8 w-auto shrink-0 lg:h-[36px]" />
        </Link>
        <p className="body-16 text-brown-700">© 2026 Livros. Todos os direitos reservados.</p>
      </div>
    </div>
  )
}

export default Footer
