import { spawn } from "node:child_process";

import { createDevEnv, findAvailablePort, nextBin, rootDir } from "./dev-shared.mjs";

const port = await findAvailablePort(3000);
const env = createDevEnv(port);

console.log(`[dev:web] Next.js em ${env.NEXTAUTH_URL}`);

const child = spawn(process.execPath, [nextBin(), "dev", "-p", String(port)], {
  cwd: rootDir,
  env,
  stdio: "inherit"
});

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  if (!child.killed) {
    child.kill();
  }

  setTimeout(() => process.exit(code), 100);
}

child.on("exit", (code) => {
  if (!shuttingDown) {
    shutdown(code ?? 0);
  }
});

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
