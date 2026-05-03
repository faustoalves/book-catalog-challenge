import { db } from './index.js'
import { assuntos } from './schema.js'
import { slugify } from '../lib/slugify.js'

const data = [
  {
    nome: 'Administração, Negócios e Economia',
    descricao:
      'Estratégias, gestão e conhecimento para empreender e prosperar no mundo dos negócios.',
  },
  {
    nome: 'Artesanato, Casa e Estilo de Vida',
    descricao: 'Inspire-se com projetos criativos, decoração e dicas para um lar especial.',
  },
  {
    nome: 'Biografias e Histórias Reais',
    descricao: 'Vidas extraordinárias e relatos verdadeiros que inspiram, emocionam e ensinam.',
  },
  {
    nome: 'Computação, Informática e Mídias Digitais',
    descricao: 'Do código às redes sociais: tudo sobre tecnologia e o universo digital.',
  },
  {
    nome: 'Direito',
    descricao:
      'Legislação, jurisprudência e conhecimento jurídico para estudantes e profissionais da área.',
  },
  {
    nome: 'Engenharia e Transporte',
    descricao: 'Fundamentos técnicos e inovações para quem constrói e move o mundo.',
  },
  {
    nome: 'Esportes e Lazer',
    descricao: 'Treinos, aventuras e atividades para quem vive o esporte com paixão.',
  },
  {
    nome: 'Gastronomia e Culinária',
    descricao: 'Receitas, técnicas e sabores para despertar o chef que há em você.',
  },
  {
    nome: 'HQs, Mangás e Graphic Novels',
    descricao: 'Histórias poderosas que unem arte sequencial e narrativas inesquecíveis.',
  },
  {
    nome: 'LGBTQ+',
    descricao:
      'Vozes, histórias e reflexões que celebram diversidade, identidade e representatividade.',
  },
  {
    nome: 'Medicina',
    descricao: 'Conhecimento clínico e científico para profissionais e curiosos da área da saúde.',
  },
  {
    nome: 'Política, Filosofia e Ciências Sociais',
    descricao: 'Pensamento crítico sobre poder, sociedade, ética e a condição humana.',
  },
  {
    nome: 'Romance',
    descricao: 'Histórias de amor, paixão e emoção que tocam o coração em cada página.',
  },
  {
    nome: 'Turismo e Guias de Viagem',
    descricao: 'Roteiros, dicas e inspiração para explorar destinos incríveis pelo mundo.',
  },
  {
    nome: 'Jovens e Adolescentes',
    descricao: 'Aventuras, descobertas e histórias feitas para a energia da juventude.',
  },
  {
    nome: 'Arte, Cinema e Fotografia',
    descricao: 'Explore criatividade, estética e linguagens visuais que transformam o olhar.',
  },
  {
    nome: 'Autoajuda',
    descricao: 'Ferramentas e motivação para desenvolver seu potencial e transformar sua vida.',
  },
  { nome: 'Ciências', descricao: 'Do universo às moléculas que explicam o mundo.' },
  {
    nome: 'Crônicas, Humor e Entretenimento',
    descricao: 'Textos leves, divertidos e perspicazes para rir e refletir.',
  },
  {
    nome: 'Educação, Referência e Didáticos',
    descricao: 'Materiais essenciais para aprender, ensinar e consultar com confiança.',
  },
  {
    nome: 'Erótico',
    descricao: 'Literatura sensual e provocante para adultos que buscam prazer na leitura.',
  },
  {
    nome: 'Fantasia, Horror e Ficção Científica',
    descricao: 'Mundos impossíveis, criaturas sombrias e futuros que desafiam a imaginação.',
  },
  {
    nome: 'História',
    descricao: 'Fatos, personagens e eventos que moldaram civilizações e definiram o presente.',
  },
  {
    nome: 'Infantil',
    descricao: 'Histórias encantadoras que estimulam a imaginação e o amor pela leitura.',
  },
  {
    nome: 'Literatura e Ficção',
    descricao: 'Narrativas autorais e clássicos universais que elevam a arte da escrita.',
  },
  {
    nome: 'Policial, Suspense e Mistério',
    descricao: 'Tramas cheias de tensão, reviravoltas e segredos impossíveis de ignorar.',
  },
  {
    nome: 'Religião e Espiritualidade',
    descricao: 'Fé, tradições e sabedoria para quem busca sentido e propósito na vida.',
  },
  {
    nome: 'Saúde e Família',
    descricao: 'Bem-estar, qualidade de vida e cuidados para você e quem você ama.',
  },
  {
    nome: 'Livros Internacionais',
    descricao: 'Obras em outros idiomas para leitores globais e aprendizes de línguas.',
  },
].map((item) => ({ ...item, slug: slugify(item.nome) }))

await db.delete(assuntos)
await db.insert(assuntos).values(data)
console.log(`${data.length} assuntos inseridos com sucesso.`)
process.exit(0)
