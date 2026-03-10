require("dotenv/config");

const http = require("http");
const next = require("next");

const { createApiApp } = require("./dist/api/app");

const dev = false;
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const nextOwnedApiPrefixes = ["/api/auth", "/api/uploads"];

function isNextOwnedApiRoute(pathname) {
  return nextOwnedApiPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

async function start() {
  const nextApp = next({ dev, hostname: host, port });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  const apiApp = createApiApp();
  const server = http.createServer((request, response) => {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    const pathname = url.pathname || "/";
    const isExpressRoute =
      pathname === "/health" || (pathname.startsWith("/api/") && !isNextOwnedApiRoute(pathname));

    if (isExpressRoute) {
      apiApp(request, response);
      return;
    }

    handle(request, response).catch((error) => {
      console.error(error);

      if (!response.headersSent) {
        response.statusCode = 500;
        response.end("Erro interno do servidor");
      }
    });
  });

  server.listen(port, host, () => {
    console.log(`Portal Honorio Bicalho ativo em http://${host}:${port}`);
  });
}

start().catch((error) => {
  console.error("Falha ao iniciar o servidor de producao:", error);
  process.exit(1);
});
