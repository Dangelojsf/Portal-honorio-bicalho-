# Arquitetura

## Visao geral

O projeto usa um unico repositório com duas superficies principais:

- Frontend Next.js App Router em [`app`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/app)
- API REST Express em [`api`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/api)

## Camadas

### UI

- Componentes reutilizaveis em [`components`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/components)
- Tokens visuais e estilos globais em [`app/globals.css`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/app/globals.css)

### Aplicacao

- Paginas publicas: home, noticias, eventos, turismo, guia comercial, historia, comunidade e contato
- Dashboard admin protegido por NextAuth
- Server Actions para CRUD e moderacao

### Dados

- Prisma como camada de persistencia para PostgreSQL
- Repositorio central em [`lib/repositories.ts`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/lib/repositories.ts)
- Fallback local em memoria para demos ou desenvolvimento sem banco

## Fluxo de dados

1. Paginas Next.js leem dados do repositório.
2. O repositório tenta Prisma.
3. Se o banco falhar ou nao estiver configurado, usa `portalStore` em memoria.
4. Server Actions revalidam as rotas publicas e o dashboard.
5. A API Express expõe os mesmos dominios para integrações externas.

## Autenticacao

- NextAuth com provider de credenciais
- Estrategia de sessao via JWT
- Credenciais administrativas vindas do banco ou do `.env`

## SEO

- Metadata por pagina
- OpenGraph global
- Structured data na home
- Conteudo e navegacao orientados para SEO local
