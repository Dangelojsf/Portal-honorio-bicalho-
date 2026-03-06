import "dotenv/config";

import cors from "cors";
import express from "express";

import { adminRouter } from "./routes/admin";
import { publicRouter } from "./routes/public";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(
  cors({
    origin: [process.env.NEXTAUTH_URL ?? "http://localhost:3000"],
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));

app.use(publicRouter);
app.use(adminRouter);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({
    error: "Erro interno do servidor"
  });
});

app.listen(port, () => {
  console.log(`Portal Honorio Bicalho API ativa em http://localhost:${port}`);
});
