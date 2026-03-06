import { CalendarDays, Home, Landmark, Mail, Newspaper, Store, Trees, Users } from "lucide-react";

export const siteConfig = {
  name: "Portal Honorio Bicalho",
  title: "Portal Honorio Bicalho | Noticias, turismo e guia do bairro",
  description:
    "Hub digital de Honorio Bicalho com noticias locais, agenda de eventos, guia comercial, turismo, historia e quadro comunitario.",
  url: "https://portalhonoriobicalho.com.br",
  location: "Honorio Bicalho, Nova Lima, Minas Gerais, Brasil",
  heroImage: "/images/hero-honorio.svg",
  seoImage: "/images/og-portal-honorio.svg"
};

export const defaultSiteSettings = {
  heroTitle: "Portal Honorio Bicalho",
  heroSubtitle: "Noticias, turismo, guia comercial e conexoes comunitarias no coracao de Nova Lima.",
  heroImage: siteConfig.heroImage,
  seoImage: siteConfig.seoImage,
  historyTitle: "A origem de Honorio Bicalho",
  historyDescription:
    "Entre a serra, a antiga estacao ferroviaria e a memoria da mineracao, Honorio Bicalho cresceu como ponto de encontro entre moradores, trabalhadores e viajantes.",
  historyImage: "/images/history-station.svg"
};

export const navigation = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/news", label: "Noticias", icon: Newspaper },
  { href: "/events", label: "Eventos", icon: CalendarDays },
  { href: "/business-directory", label: "Guia Comercial", icon: Store },
  { href: "/tourism", label: "Turismo", icon: Trees },
  { href: "/history", label: "Historia", icon: Landmark },
  { href: "/community", label: "Comunidade", icon: Users },
  { href: "/contact", label: "Contato", icon: Mail }
];

export const historyStory = {
  title: defaultSiteSettings.historyTitle,
  description: defaultSiteSettings.historyDescription,
  image: defaultSiteSettings.historyImage,
  highlights: [
    {
      year: "1895",
      title: "Chegada da ferrovia",
      description:
        "A estacao impulsionou o fluxo de pessoas e consolidou o territorio como conexao entre Minas e o entorno da Serra do Curral."
    },
    {
      year: "1920",
      title: "Crescimento do nucleo urbano",
      description:
        "Comercio, pequenos servicos e moradias se organizaram ao redor da linha ferrea e da igreja local."
    },
    {
      year: "Hoje",
      title: "Identidade comunitaria",
      description:
        "O bairro preserva memoria historica e paisagens naturais, enquanto amplia oportunidades para turismo e economia local."
    }
  ]
};

export const contactCards = [
  {
    title: "Prefeitura de Nova Lima",
    description: "Canais uteis para servicos publicos, infraestrutura e agenda institucional.",
    link: "https://www.novalima.mg.gov.br"
  },
  {
    title: "Comercio local",
    description: "Quer entrar no guia comercial? Use o painel administrativo ou fale com a equipe do portal.",
    link: "mailto:contato@portalhonoriobicalho.com.br"
  },
  {
    title: "Cobertura comunitaria",
    description: "Sugira pautas, envie fotos e compartilhe acontecimentos relevantes do bairro.",
    link: "mailto:redacao@portalhonoriobicalho.com.br"
  }
];
