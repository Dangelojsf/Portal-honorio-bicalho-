import type {
  PortalBusiness,
  PortalCategory,
  PortalCommunityPost,
  PortalEvent,
  PortalNews,
  PortalTourismSpot,
  PortalUser
} from "../types/portal";

const newsCategories: PortalCategory[] = [
  { id: "cat-news-bairro", name: "Bairro", slug: "bairro", type: "news" },
  { id: "cat-news-eventos", name: "Eventos", slug: "eventos", type: "news" },
  { id: "cat-news-emprego", name: "Emprego", slug: "emprego", type: "news" },
  { id: "cat-news-cultura", name: "Cultura", slug: "cultura", type: "news" },
  { id: "cat-news-esporte", name: "Esporte", slug: "esporte", type: "news" },
  { id: "cat-news-infraestrutura", name: "Infraestrutura", slug: "infraestrutura", type: "news" }
];

const businessCategories: PortalCategory[] = [
  { id: "cat-business-bares", name: "Bares", slug: "bares", type: "business" },
  { id: "cat-business-restaurantes", name: "Restaurantes", slug: "restaurantes", type: "business" },
  { id: "cat-business-mercados", name: "Mercados", slug: "mercados", type: "business" },
  { id: "cat-business-oficinas", name: "Oficinas", slug: "oficinas", type: "business" },
  { id: "cat-business-servicos", name: "Servicos", slug: "servicos", type: "business" },
  { id: "cat-business-comercio", name: "Comercio", slug: "comercio", type: "business" }
];

const communityCategories: PortalCategory[] = [
  { id: "cat-community-announcements", name: "Avisos", slug: "announcements", type: "community" },
  { id: "cat-community-jobs", name: "Empregos", slug: "jobs", type: "community" },
  { id: "cat-community-services", name: "Servicos", slug: "services", type: "community" },
  { id: "cat-community-lost", name: "Achados e perdidos", slug: "lost-items", type: "community" }
];

export const mockCategories: PortalCategory[] = [
  ...newsCategories,
  ...businessCategories,
  ...communityCategories
];

const categoryById = Object.fromEntries(mockCategories.map((category) => [category.id, category]));

export const mockUsers: PortalUser[] = [
  {
    id: "user-admin",
    name: "Equipe Portal Honorio Bicalho",
    email: "admin@portalhonoriobicalho.com.br",
    role: "admin",
    image: null
  },
  {
    id: "user-moradora-luana",
    name: "Luana Oliveira",
    email: "luana@exemplo.com",
    role: "resident",
    image: null
  }
];

export const mockNews: PortalNews[] = [
  {
    id: "news-1",
    title: "Obras de pavimentacao avancam no centro de Honorio Bicalho",
    slug: "obras-de-pavimentacao-avancam-no-centro",
    content:
      "A nova etapa de pavimentacao contempla ruas de maior circulacao no centro do bairro, com foco em drenagem, acessibilidade e melhoria do fluxo local. Moradores acompanham a expectativa de reduzir poeira, lama e pontos de acumulacao de agua em periodos de chuva.",
    image: "/images/news-scene.svg",
    author: "Redacao do Portal",
    category: categoryById["cat-news-infraestrutura"],
    publishedAt: "2026-03-03T09:00:00.000Z"
  },
  {
    id: "news-2",
    title: "Campeonato no campo do Cruzeiro movimenta o fim de semana",
    slug: "campeonato-no-campo-do-cruzeiro",
    content:
      "Equipes amadoras de Honorio Bicalho e bairros vizinhos participam da rodada decisiva do campeonato local. A iniciativa envolve jovens atletas, comerciantes e familias, reforcando o papel do esporte como encontro comunitario.",
    image: "/images/news-scene.svg",
    author: "Marcos Vieira",
    category: categoryById["cat-news-esporte"],
    publishedAt: "2026-03-01T14:30:00.000Z"
  },
  {
    id: "news-3",
    title: "Vagas temporarias em servicos e comercio seguem abertas na regiao",
    slug: "vagas-temporarias-em-servicos-e-comercio",
    content:
      "Empresas e pequenos negocios do entorno estao divulgando oportunidades para atendimento, apoio operacional, manutencao e servicos gerais. O portal reuniu os principais contatos para facilitar a conexao entre moradores e contratantes.",
    image: "/images/news-scene.svg",
    author: "Equipe Economia Local",
    category: categoryById["cat-news-emprego"],
    publishedAt: "2026-02-27T12:00:00.000Z"
  },
  {
    id: "news-4",
    title: "Arraia comunitario confirma programacao cultural para maio",
    slug: "arraia-comunitario-confirma-programacao-cultural",
    content:
      "Bandas locais, quadrilhas, barraquinhas e apresentacoes escolares devem compor a programacao da festa junina de Honorio Bicalho. A organizacao ja mobiliza voluntarios e comerciantes parceiros para a estrutura do evento.",
    image: "/images/news-scene.svg",
    author: "Redacao Cultura",
    category: categoryById["cat-news-cultura"],
    publishedAt: "2026-02-24T16:00:00.000Z"
  },
  {
    id: "news-5",
    title: "Mutirao de limpeza convoca moradores para cuidar das vias e pracas",
    slug: "mutirao-de-limpeza-convoca-moradores",
    content:
      "Associacoes locais e liderancas comunitarias organizaram um mutirao para limpeza de areas de convivencia e recolhimento de pequenos descartes em pontos de maior circulacao. A acao tambem vai reunir orientacoes sobre descarte correto.",
    image: "/images/news-scene.svg",
    author: "Coletivo do Bairro",
    category: categoryById["cat-news-bairro"],
    publishedAt: "2026-02-20T10:00:00.000Z"
  }
];

export const mockEvents: PortalEvent[] = [
  {
    id: "event-1",
    title: "Festa da Mandioca",
    description:
      "Evento gastronomico com pratos tipicos, musica ao vivo e expositores da regiao. Ideal para familias e visitantes.",
    date: "2026-05-14T20:00:00.000Z",
    time: "20h",
    location: "Praca Central de Honorio Bicalho",
    image: "/images/event-scene.svg",
    organizer: "Associacao de Moradores",
    latitude: -20.019,
    longitude: -43.846
  },
  {
    id: "event-2",
    title: "Trilha da Serra do Curral",
    description:
      "Saida guiada para grupos pequenos, com observacao da paisagem, orientacao ambiental e pontos panoramicos.",
    date: "2026-05-18T08:00:00.000Z",
    time: "08h",
    location: "Ponto de encontro na antiga estacao",
    image: "/images/event-scene.svg",
    organizer: "Guia Serra Viva",
    latitude: -20.016,
    longitude: -43.851
  },
  {
    id: "event-3",
    title: "Arraia do Bicalho",
    description:
      "Quadrilha, barraquinhas e apresentacoes culturais em uma noite de celebracao comunitaria no coracao do bairro.",
    date: "2026-05-25T19:00:00.000Z",
    time: "19h",
    location: "Quadra comunitaria",
    image: "/images/event-scene.svg",
    organizer: "Escola Municipal",
    latitude: -20.018,
    longitude: -43.844
  },
  {
    id: "event-4",
    title: "Feira de pequenos negocios",
    description:
      "Empreendedores da regiao apresentam produtos artesanais, alimentacao e servicos em um formato aberto ao publico.",
    date: "2026-04-12T10:00:00.000Z",
    time: "10h",
    location: "Centro comunitario",
    image: "/images/event-scene.svg",
    organizer: "Rede Empreende Bicalho",
    latitude: -20.014,
    longitude: -43.843
  },
  {
    id: "event-5",
    title: "Cine ao ar livre na praca",
    description:
      "Sessao gratuita com producao brasileira, cadeiras comunitarias e venda de lanches por negocios locais.",
    date: "2026-04-28T19:30:00.000Z",
    time: "19h30",
    location: "Praca da Igreja",
    image: "/images/event-scene.svg",
    organizer: "Coletivo Cultura na Rua",
    latitude: -20.017,
    longitude: -43.845
  }
];

export const mockBusinesses: PortalBusiness[] = [
  {
    id: "business-1",
    name: "Bica Burger",
    slug: "bica-burger",
    description: "Hamburgueria artesanal com entregas na regiao e cardapio noturno.",
    address: "Rua da Estacao, 58",
    phone: "(31) 98888-1101",
    website: "https://bica-burger.example.com",
    instagram: "@bicaburger",
    latitude: -20.017,
    longitude: -43.846,
    images: ["/images/business-scene.svg"],
    category: categoryById["cat-business-restaurantes"]
  },
  {
    id: "business-2",
    name: "Mercado Serra Viva",
    slug: "mercado-serra-viva",
    description: "Mercado de bairro com hortifruti, padaria e atendimento diario.",
    address: "Avenida Principal, 101",
    phone: "(31) 98888-1102",
    website: null,
    instagram: "@mercadoserraviva",
    latitude: -20.018,
    longitude: -43.848,
    images: ["/images/business-scene.svg"],
    category: categoryById["cat-business-mercados"]
  },
  {
    id: "business-3",
    name: "Oficina Cruzeiro",
    slug: "oficina-cruzeiro",
    description: "Mecanica rapida, alinhamento e revisao para carros e motos.",
    address: "Rua do Campo, 14",
    phone: "(31) 98888-1103",
    website: null,
    instagram: "@oficinacruzeiro",
    latitude: -20.015,
    longitude: -43.847,
    images: ["/images/business-scene.svg"],
    category: categoryById["cat-business-oficinas"]
  },
  {
    id: "business-4",
    name: "Casa da Mantiqueira",
    slug: "casa-da-mantiqueira",
    description: "Cafe, paes e doces com vista para as montanhas.",
    address: "Largo da Igreja, 7",
    phone: "(31) 98888-1104",
    website: "https://casa-mantiqueira.example.com",
    instagram: "@casadamantiqueira",
    latitude: -20.019,
    longitude: -43.845,
    images: ["/images/business-scene.svg"],
    category: categoryById["cat-business-bares"]
  },
  {
    id: "business-5",
    name: "Atelie Horizonte",
    slug: "atelie-horizonte",
    description: "Artesanato, presentes e itens decorativos produzidos na regiao.",
    address: "Rua das Flores, 11",
    phone: "(31) 98888-1105",
    website: null,
    instagram: "@ateliehorizonte",
    latitude: -20.013,
    longitude: -43.844,
    images: ["/images/business-scene.svg"],
    category: categoryById["cat-business-comercio"]
  },
  {
    id: "business-6",
    name: "Pouso da Serra Hostel",
    slug: "pouso-da-serra-hostel",
    description: "Hospedagem compacta para trilheiros, ciclistas e visitantes de fim de semana.",
    address: "Rua do Mirante, 63",
    phone: "(31) 98888-1106",
    website: "https://pousodaserra.example.com",
    instagram: "@pousodaserra",
    latitude: -20.012,
    longitude: -43.851,
    images: ["/images/business-scene.svg"],
    category: categoryById["cat-business-servicos"]
  },
  {
    id: "business-7",
    name: "Restaurante Dona Tereza",
    slug: "restaurante-dona-tereza",
    description: "Comida mineira no fogao a lenha e almoco executivo durante a semana.",
    address: "Avenida Principal, 45",
    phone: "(31) 98888-1107",
    website: null,
    instagram: "@donaterezabicalho",
    latitude: -20.016,
    longitude: -43.843,
    images: ["/images/business-scene.svg"],
    category: categoryById["cat-business-restaurantes"]
  },
  {
    id: "business-8",
    name: "Mercadinho da Ponte",
    slug: "mercadinho-da-ponte",
    description: "Produtos essenciais, agua, gelo e conveniencia para moradores e turistas.",
    address: "Rua da Ponte, 9",
    phone: "(31) 98888-1108",
    website: null,
    instagram: "@mercadinhodaponte",
    latitude: -20.02,
    longitude: -43.849,
    images: ["/images/business-scene.svg"],
    category: categoryById["cat-business-mercados"]
  },
  {
    id: "business-9",
    name: "Bicalho Bike Service",
    slug: "bicalho-bike-service",
    description: "Revisao de bicicletas, aluguel de equipamentos e apoio a rotas da regiao.",
    address: "Rua do Mirante, 18",
    phone: "(31) 98888-1109",
    website: "https://bicalhobike.example.com",
    instagram: "@bicalhobike",
    latitude: -20.011,
    longitude: -43.852,
    images: ["/images/business-scene.svg"],
    category: categoryById["cat-business-servicos"]
  },
  {
    id: "business-10",
    name: "Armazem do Bicalho",
    slug: "armazem-do-bicalho",
    description: "Loja de utilidades, ferragens e itens para manutencao residencial.",
    address: "Rua do Comercio, 88",
    phone: "(31) 98888-1110",
    website: null,
    instagram: "@armazemdobicalho",
    latitude: -20.014,
    longitude: -43.846,
    images: ["/images/business-scene.svg"],
    category: categoryById["cat-business-comercio"]
  }
];

export const mockTourismSpots: PortalTourismSpot[] = [
  {
    id: "spot-1",
    name: "Trilha da Cachoeira",
    slug: "trilha-da-cachoeira",
    description:
      "Percurso cercado por mata, com trechos sombreados e um poco de agua limpa no fim da caminhada.",
    type: "cachoeiras",
    difficulty: "moderada",
    location: "Vale da Serra",
    latitude: -20.01,
    longitude: -43.854,
    image: "/images/tourism-scene.svg"
  },
  {
    id: "spot-2",
    name: "Mirante do Bicalho",
    slug: "mirante-do-bicalho",
    description:
      "Ponto panoramico com vista aberta para o vale e para a arquitetura do bairro, ideal no nascer do sol.",
    type: "mirantes",
    difficulty: "leve",
    location: "Alto da Serra",
    latitude: -20.008,
    longitude: -43.85,
    image: "/images/tourism-scene.svg"
  },
  {
    id: "spot-3",
    name: "Estacao Ferroviaria Historica",
    slug: "estacao-ferroviaria-historica",
    description:
      "Marco da memoria local, a antiga estacao conecta o passado ferroviario a novos roteiros de visita e fotografia.",
    type: "historico",
    difficulty: "leve",
    location: "Centro historico",
    latitude: -20.017,
    longitude: -43.847,
    image: "/images/history-station.svg"
  },
  {
    id: "spot-4",
    name: "Trilha do Cruzeiro",
    slug: "trilha-do-cruzeiro",
    description:
      "Subida curta com visuais amplos da vegetacao e do nucleo urbano, popular entre caminhadas do fim da tarde.",
    type: "trilhas",
    difficulty: "moderada",
    location: "Encosta do Cruzeiro",
    latitude: -20.015,
    longitude: -43.853,
    image: "/images/tourism-scene.svg"
  },
  {
    id: "spot-5",
    name: "Poente da Serra",
    slug: "poente-da-serra",
    description:
      "Area aberta para contemplacao do por do sol, muito procurada por ciclistas e visitantes no fim de semana.",
    type: "mirantes",
    difficulty: "leve",
    location: "Estrada do Mirante",
    latitude: -20.009,
    longitude: -43.848,
    image: "/images/tourism-scene.svg"
  }
];

export const mockCommunityPosts: PortalCommunityPost[] = [
  {
    id: "community-1",
    title: "Procuro diarista para atendimento quinzenal",
    content:
      "Familia no centro de Honorio Bicalho busca diarista para duas visitas por mes. Interessadas podem enviar contato por e-mail.",
    authorName: "Luciana Souza",
    authorEmail: "luciana@exemplo.com",
    category: categoryById["cat-community-jobs"],
    status: "approved",
    createdAt: "2026-03-02T13:15:00.000Z"
  },
  {
    id: "community-2",
    title: "Aula de reforco escolar para ensino fundamental",
    content:
      "Professor de matematica oferece acompanhamento para alunos do ensino fundamental com encontros presenciais no bairro.",
    authorName: "Rafael Mendes",
    authorEmail: "rafael@exemplo.com",
    category: categoryById["cat-community-services"],
    status: "approved",
    createdAt: "2026-03-01T18:10:00.000Z"
  },
  {
    id: "community-3",
    title: "Carteira encontrada proximo a praca",
    content:
      "Foi encontrada uma carteira marrom proximo a igreja. Se for sua, entre em contato com a administracao do portal para identificacao.",
    authorName: "Luana Oliveira",
    authorEmail: "luana@exemplo.com",
    category: categoryById["cat-community-lost"],
    status: "pending",
    createdAt: "2026-03-05T08:45:00.000Z"
  }
];
