# Arquitetura

## Visao geral

O projeto usa um unico repositorio com duas superficies principais:

- Frontend Next.js App Router em [`app`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/app)
- API REST Express em [`api`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/api)

Em desenvolvimento, o frontend e a API podem rodar em portas separadas. Em producao, o projeto tambem suporta um unico processo Node em [`server.js`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/server.js), modelo pensado para deploys gerenciados como Hostinger.

## Camadas

### UI

- Componentes reutilizaveis em [`components`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/components)
- Tokens visuais e estilos globais em [`app/globals.css`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/app/globals.css)

### Aplicacao

- Paginas publicas: home, noticias, eventos, turismo, guia comercial, historia, comunidade e contato
- Dashboard admin protegido por NextAuth
- Server Actions para CRUD, configuracoes e moderacao
- API REST Express para integracoes externas

### Dados

- Prisma como camada de persistencia para MySQL/MariaDB
- Repositorio central em [`lib/repositories.ts`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/lib/repositories.ts)
- Fallback local em arquivo para demos ou ambientes sem MySQL

## Fluxo de dados

1. Paginas Next.js leem dados do repositorio.
2. O repositorio tenta Prisma quando `DATABASE_URL` existe.
3. Se o banco falhar ou nao estiver configurado, usa `portalStore` persistido em `data/portal-store.json`.
4. Server Actions revalidam as rotas publicas afetadas e `/admin`.
5. A API Express expoe os mesmos dominios para integracoes externas.

## Runtime de producao

- `npm run build` gera o bundle Next.js e compila a camada Express para `dist/`
- `npm run start` sobe um unico processo Node
- As rotas REST ficam no mesmo dominio do portal
- As rotas internas do Next, como `/api/auth` e `/api/uploads`, continuam sendo atendidas pelo App Router

## Autenticacao

- NextAuth com provider de credenciais
- Estrategia de sessao via JWT
- Credenciais administrativas vindas do banco ou do `.env`

## SEO

- Metadata por pagina
- OpenGraph global
- Structured data na home
- Conteudo e navegacao orientados para SEO local
