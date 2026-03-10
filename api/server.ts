import "dotenv/config";

import { createApiApp } from "./app";

const app = createApiApp();
const host = process.env.HOST ?? "0.0.0.0";
const port = Number(process.env.PORT ?? 4000);

app.listen(port, host, () => {
  console.log(`Portal Honorio Bicalho API ativa em http://${host}:${port}`);
});
