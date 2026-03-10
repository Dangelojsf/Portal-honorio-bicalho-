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

function getNextDigest(error) {
  if (!error || typeof error !== "object" || !("digest" in error)) {
    return "";
  }

  const digest = error.digest;
  return typeof digest === "string" ? digest : "";
}

function handleNextControlFlowError(error, response) {
  const digest = getNextDigest(error);

  if (!digest) {
    return false;
  }

  if (digest.startsWith("NEXT_REDIRECT;")) {
    const parts = digest.split(";");
    const location = parts[2] || "/";
    const statusCode = Number.parseInt(parts[3] || "307", 10);

    if (!response.headersSent) {
      response.statusCode = Number.isFinite(statusCode) ? statusCode : 307;
      response.setHeader("Location", location);
      response.end();
    }

    return true;
  }

  if (digest === "NEXT_NOT_FOUND" || digest.startsWith("NEXT_HTTP_ERROR_FALLBACK;404")) {
    if (!response.headersSent) {
      response.statusCode = 404;
      response.end("Pagina nao encontrada");
    }

    return true;
  }

  return false;
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
      if (handleNextControlFlowError(error, response)) {
        return;
      }

      console.error(`Falha em ${request.method || "GET"} ${pathname}`);
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
