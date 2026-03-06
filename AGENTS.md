# AGENTS

## Objetivo

Este repositório implementa o Portal Honorio Bicalho como uma plataforma comunitaria full-stack com frontend Next.js e API Express.

## Regras locais

- Preserve o fallback local em memoria presente em [`lib/repositories.ts`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/lib/repositories.ts). Ele permite demonstracao sem PostgreSQL ativo.
- Nos arquivos executados diretamente pelo Node (`api/`, `prisma/seed.ts`, `lib/` compartilhado com a API), prefira imports relativos em vez de aliases `@/`.
- Alteracoes em dados administrativos devem revalidar as rotas publicas afetadas e `/admin`.
- Novos endpoints REST devem entrar em [`api/routes/public.ts`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/api/routes/public.ts) ou [`api/routes/admin.ts`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/api/routes/admin.ts).
- Se adicionar novos modelos Prisma, atualize o seed e os mocks locais.
- Mantenha o design coerente com a paleta definida em [`app/globals.css`](/d:/Users/Treinamento/Desktop/site%20Honorio%20bicalho/app/globals.css).

## Fluxo recomendado

1. Ajuste schema e repositorio.
2. Atualize API Express.
3. Atualize paginas e componentes.
4. Revalide dados de exemplo, README e docs.
