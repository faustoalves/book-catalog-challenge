import Link from 'next/link'
import Logo from '../elements/logo/Logo'

const Footer = () => {
  return (
    <div className="bg-cream-300 lg:py-18 border-cream-300 flex flex-col items-center justify-center border-t py-12">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-8 px-8 lg:flex-row">
        <Link href="/">
          <Logo className="h-[35px] w-auto shrink-0 lg:h-10" />
        </Link>
        <p className="body-16 text-cream-800">© 2026. Todos os direitos reservados.</p>
      </div>
    </div>
  )
}

export default Footer
