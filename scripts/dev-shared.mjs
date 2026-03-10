import net from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function nextBin() {
  return resolve(rootDir, "node_modules/next/dist/bin/next");
}

export function tsxBin() {
  return resolve(rootDir, "node_modules/tsx/dist/cli.mjs");
}

export async function findAvailablePort(startPort = 3000, maxAttempts = 20) {
  for (let port = startPort; port < startPort + maxAttempts; port += 1) {
    const isOpen = await canListen(port);
    if (isOpen) {
      return port;
    }
  }

  throw new Error(`Nao foi possivel encontrar porta livre a partir de ${startPort}.`);
}

function canListen(port) {
  return new Promise((resolvePromise) => {
    const server = net.createServer();

    server.once("error", () => {
      resolvePromise(false);
    });

    server.once("listening", () => {
      server.close(() => resolvePromise(true));
    });

    server.listen(port);
  });
}

export function createDevEnv(port, apiPort = null) {
  const env = {
    ...process.env,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || `http://localhost:${port}`,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "portal-honorio-bicalho-dev-secret"
  };

  if (apiPort !== null) {
    env.PORT = process.env.PORT || String(apiPort);
  }

  return env;
}
