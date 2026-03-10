# Deploy na Hostinger

## Runtime

O portal foi padronizado para subir em um unico processo Node:

- Site Next.js
- Rotas REST do Express
- Upload local em `public/uploads`

Com isso, a configuracao recomendada na Hostinger fica:

- Node.js: `20.x`
- Build command: `npm run build`
- Start command: `npm run start`

## Variaveis de ambiente

Defina no painel da Hostinger:

- `NEXTAUTH_URL`: dominio publico final do portal
- `NEXTAUTH_SECRET`: segredo forte para sessao
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_API_TOKEN`
- `GOOGLE_MAPS_API_KEY` e `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` se quiser o mapa completo

Opcional:

- `DATABASE_URL`: URL MySQL, por exemplo `mysql://usuario:senha@host:3306/portal_honorio_bicalho`

Nao configure:

- `PORT`
- `NEXT_PUBLIC_API_URL`

## Banco de dados

O projeto continua com dois modos:

- Com `DATABASE_URL`: usa Prisma + MySQL/MariaDB
- Sem `DATABASE_URL`: usa o fallback local em `data/portal-store.json`

Para ambiente publico, o ideal e usar MySQL/MariaDB externo se voce quiser persistencia confiavel de noticias, eventos, negocios e moderacao apos novos deploys.

Quando `DATABASE_URL` estiver configurada com MySQL, o `npm run build` executa `prisma migrate deploy` automaticamente antes do build da aplicacao.

## Checklist

1. Suba o projeto completo.
2. Configure as variaveis de ambiente.
3. Rode o build com `npm run build`.
4. Inicie com `npm run start`.
5. Valide `https://seu-dominio/health`.
6. Teste login em `/login`.
7. Teste upload no painel `/admin`.
