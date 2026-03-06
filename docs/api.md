# API REST

Base local padrao: `http://localhost:4000`

## Publica

### `GET /health`

Status basico da API.

### `GET /api/home`

Payload agregado para a home.

### `GET /api/news`

Lista noticias. Suporta `?limit=3`.

### `GET /api/news/:slug`

Retorna noticia individual.

### `GET /api/events`

Lista eventos.

### `GET /api/businesses`

Lista negocios do guia comercial.

### `GET /api/tourism`

Lista atrativos turisticos.

### `GET /api/community`

Lista posts comunitarios. Suporta `?status=approved|pending|rejected`.

### `POST /api/community`

Cria um post comunitario pendente.

Body:

```json
{
  "title": "Procuro eletricista",
  "content": "Servico para residencia no centro.",
  "authorName": "Maria",
  "authorEmail": "maria@exemplo.com",
  "categoryId": "cat-community-services"
}
```

### `GET /api/map`

Retorna pontos geolocalizados de negocios, turismo e eventos.

## Admin

As rotas abaixo exigem:

- Header `x-admin-token: <token>`
- Ou `Authorization: Bearer <token>`

### `GET /api/admin/dashboard`

Resumo administrativo.

### `POST /api/admin/news`

Cria ou atualiza noticia.

### `DELETE /api/admin/news/:id`

Exclui noticia.

### `POST /api/admin/events`

Cria ou atualiza evento.

### `DELETE /api/admin/events/:id`

Exclui evento.

### `POST /api/admin/businesses`

Cria ou atualiza negocio.

### `DELETE /api/admin/businesses/:id`

Exclui negocio.

### `POST /api/admin/tourism`

Cria ou atualiza ponto turistico.

### `DELETE /api/admin/tourism/:id`

Exclui ponto turistico.

### `PATCH /api/admin/community/:id`

Atualiza status de moderacao.

Body:

```json
{
  "status": "approved"
}
```

### `DELETE /api/admin/community/:id`

Remove post comunitario.
