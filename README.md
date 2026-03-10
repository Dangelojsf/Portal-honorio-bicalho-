# Portal Honorio Bicalho

Plataforma digital comunitaria para Honorio Bicalho, Nova Lima, Minas Gerais. O projeto combina portal de noticias, agenda de eventos, guia comercial, turismo local, quadro comunitario moderado e dashboard administrativo.

## Stack

- Next.js 14 + React + TypeScript
- Tailwind CSS + componentes no estilo ShadCN UI
- Express para API externa
- Prisma + MySQL/MariaDB
- NextAuth com login administrativo por credenciais
- Google Maps API com fallback visual quando a chave nao esta configurada
- Docker para ambiente containerizado

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Copie `.env.example` para `.env` e ajuste os valores.

3. Rode o ambiente de desenvolvimento:

```bash
npm run dev
```

O frontend abre em `http://localhost:3000` e a API Express em `http://localhost:4000`.

Se a porta `3000` estiver ocupada, o script de desenvolvimento escolhe a proxima porta livre automaticamente e ajusta `NEXTAUTH_URL` para manter o login administrativo funcional. O mesmo vale para a API, que parte de `4000`.

## Modo fallback

O portal foi implementado para continuar funcional mesmo sem banco inicializado. Se `DATABASE_URL` nao estiver disponivel ou o MySQL estiver offline, o site usa um store local em `data/portal-store.json`.

Isso significa que:

- alteracoes feitas no painel admin continuam salvas entre reinicios locais
- os arquivos enviados seguem em `public/uploads`
- se voce apagar `data/portal-store.json`, o portal volta para os dados padrao de demonstracao

## Upload de imagens

O dashboard administrativo possui upload para os campos de imagem. Os arquivos enviados sao gravados em `public/uploads` e passam a ficar acessiveis por URLs como `/uploads/arquivo.jpg`.

Observacao:

- Em ambiente local ou self-hosted isso funciona normalmente.
- Em Vercel, armazenamento em disco nao e persistente. Para producao nessa plataforma, substitua o upload local por um provedor como Vercel Blob, S3 ou Cloudinary.

Para persistencia real:

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

## Credenciais administrativas padrao

- Email: `admin@portalhonoriobicalho.com.br`
- Senha: `admin1234`

Altere esses valores no `.env` antes de publicar.

## Scripts principais

- `npm run dev`: Next.js + Express em paralelo
- `npm run build`: build do portal e compilacao do runtime Node de producao
- `npm run start`: sobe portal e API REST no mesmo processo Node
- `npm run start:web`: sobe apenas o Next.js
- `npm run start:api`: sobe apenas a API Express
- `npm run prisma:deploy`: aplica migrations MySQL em ambiente de deploy quando `DATABASE_URL` estiver configurada
- `npm run prisma:generate`: gera o client do Prisma
- `npm run prisma:migrate`: executa migracoes locais
- `npm run prisma:seed`: popula o banco com dados de exemplo

## Estrutura

- [`app`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/app): paginas Next.js App Router
- [`components`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/components): blocos visuais e componentes UI
- [`api`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/api): servidor Express e rotas REST
- [`lib`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/lib): repositorios, auth, utilitarios e dados mock
- [`prisma`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/prisma): schema e seed
- [`docs`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/docs): documentacao complementar
- [`docker`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/docker): compose e Dockerfile da API

## Deploy

### Hostinger

Para deploy em Hostinger, o fluxo mais seguro agora e usar o projeto como um unico app Node:

- Versao do Node: `20.x`
- Build command: `npm run build`
- Start command: `npm run start`
- `PORT`: nao configure manualmente. A plataforma injeta essa variavel.
- `NEXTAUTH_URL`: use a URL publica final do portal, por exemplo `https://portal.seudominio.com`

Observacoes importantes:

- Em producao, as rotas REST do Express respondem no mesmo dominio do site, sem depender de uma porta `4000` publica.
- Se voce nao tiver MySQL externo, pode deixar `DATABASE_URL` vazio e o portal continuara funcional com o fallback em `data/portal-store.json`.
- Se `DATABASE_URL` estiver configurada com MySQL, `npm run build` executa `prisma migrate deploy` antes do build.
- Para persistencia administrativa real em producao, use MySQL/MariaDB externo com porta `3306`.
- Uploads continuam sendo gravados em `public/uploads`. Em qualquer deploy que substitua os arquivos da aplicacao, use armazenamento externo se quiser preservar imagens entre reimplantes.

### Outros cenarios

- Docker: [`Dockerfile`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/Dockerfile)
- API separada: [`docker/api.Dockerfile`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/docker/api.Dockerfile)
- Banco: MySQL/MariaDB gerenciado ou fallback local

## API

Resumo rapido:

- `GET /health`
- `GET /api/home`
- `GET /api/news`
- `GET /api/events`
- `GET /api/businesses`
- `GET /api/tourism`
- `GET /api/community`
- `POST /api/community`
- `GET /api/map`
- `GET /api/admin/dashboard`
- `POST /api/admin/news`
- `POST /api/admin/events`
- `POST /api/admin/businesses`
- `POST /api/admin/tourism`

As rotas administrativas exigem `x-admin-token` ou `Authorization: Bearer <token>`.

## Documentacao adicional

- [`docs/architecture.md`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/docs/architecture.md)
- [`docs/api.md`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/docs/api.md)
- [`docs/deploy-hostinger.md`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/docs/deploy-hostinger.md)
