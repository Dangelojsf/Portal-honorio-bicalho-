import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const prismaCli = resolve(rootDir, "node_modules", "prisma", "build", "index.js");
const fallbackDatabaseUrl = "mysql://root:root@127.0.0.1:3306/portal_honorio_bicalho";
const configuredDatabaseUrl = process.env.DATABASE_URL?.trim();
const databaseUrl =
  configuredDatabaseUrl && configuredDatabaseUrl.startsWith("mysql://")
    ? configuredDatabaseUrl
    : fallbackDatabaseUrl;

const child = spawn(process.execPath, [prismaCli, "generate"], {
  cwd: rootDir,
  env: {
    ...process.env,
    DATABASE_URL: databaseUrl
  },
  stdio: "inherit"
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
