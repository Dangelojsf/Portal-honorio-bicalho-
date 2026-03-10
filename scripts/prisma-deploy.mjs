import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const prismaCli = resolve(rootDir, "node_modules", "prisma", "build", "index.js");
const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl || !databaseUrl.startsWith("mysql://")) {
  console.log("[prisma:deploy] DATABASE_URL MySQL nao configurada. Pulando migrate deploy.");
  process.exit(0);
}

const child = spawn(process.execPath, [prismaCli, "migrate", "deploy"], {
  cwd: rootDir,
  env: process.env,
  stdio: "inherit"
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
