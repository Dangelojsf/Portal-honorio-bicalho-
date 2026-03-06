import { spawn } from "node:child_process";

import { createDevEnv, findAvailablePort, nextBin, rootDir, tsxBin } from "./dev-shared.mjs";

const port = await findAvailablePort(3000);
const apiPort = await findAvailablePort(4000);
const env = createDevEnv(port, apiPort);

console.log(`[dev] Next.js em ${env.NEXTAUTH_URL}`);
console.log(`[dev] API Express em http://localhost:${apiPort}`);

const processes = [
  spawn(process.execPath, [nextBin(), "dev", "-p", String(port)], {
    cwd: rootDir,
    env,
    stdio: "inherit"
  }),
  spawn(process.execPath, [tsxBin(), "watch", "api/server.ts"], {
    cwd: rootDir,
    env,
    stdio: "inherit"
  })
];

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) {
      child.kill();
    }
  }

  setTimeout(() => process.exit(code), 100);
}

for (const child of processes) {
  child.on("exit", (code) => {
    if (!shuttingDown) {
      shutdown(code ?? 0);
    }
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
