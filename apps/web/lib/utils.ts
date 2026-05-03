import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ASSUNTOS_LIST = [
  { nome: 'Administração, Negócios e Economia', slug: 'administracao-negocios-e-economia' },
  { nome: 'Arte, Cinema e Fotografia', slug: 'arte-cinema-e-fotografia' },
  { nome: 'Artesanato, Casa e Estilo de Vida', slug: 'artesanato-casa-e-estilo-de-vida' },
  { nome: 'Autoajuda', slug: 'autoajuda' },
  { nome: 'Biografias e Histórias Reais', slug: 'biografias-e-historias-reais' },
  { nome: 'Ciências', slug: 'ciencias' },
  {
    nome: 'Computação, Informática e Mídias Digitais',
    slug: 'computacao-informatica-e-midias-digitais',
  },
  { nome: 'Crônicas, Humor e Entretenimento', slug: 'cronicas-humor-e-entretenimento' },
  { nome: 'Direito', slug: 'direito' },
  { nome: 'Educação, Referência e Didáticos', slug: 'educacao-referencia-e-didaticos' },
  { nome: 'Engenharia e Transporte', slug: 'engenharia-e-transporte' },
  { nome: 'Erótico', slug: 'erotico' },
  { nome: 'Esportes e Lazer', slug: 'esportes-e-lazer' },
  { nome: 'Fantasia, Horror e Ficção Científica', slug: 'fantasia-horror-e-ficcao-cientifica' },
  { nome: 'Gastronomia e Culinária', slug: 'gastronomia-e-culinaria' },
  { nome: 'HQs, Mangás e Graphic Novels', slug: 'hqs-mangas-e-graphic-novels' },
  { nome: 'História', slug: 'historia' },
  { nome: 'Infantil', slug: 'infantil' },
  { nome: 'Jovens e Adolescentes', slug: 'jovens-e-adolescentes' },
  { nome: 'LGBTQ+', slug: 'lgbtq' },
  { nome: 'Literatura e Ficção', slug: 'literatura-e-ficcao' },
  { nome: 'Livros Internacionais', slug: 'livros-internacionais' },
  { nome: 'Medicina', slug: 'medicina' },
  { nome: 'Policial, Suspense e Mistério', slug: 'policial-suspense-e-misterio' },
  { nome: 'Política, Filosofia e Ciências Sociais', slug: 'politica-filosofia-e-ciencias-sociais' },
  { nome: 'Religião e Espiritualidade', slug: 'religiao-e-espiritualidade' },
  { nome: 'Romance', slug: 'romance' },
  { nome: 'Saúde e Família', slug: 'saude-e-familia' },
  { nome: 'Turismo e Guias de Viagem', slug: 'turismo-e-guias-de-viagem' },
]
