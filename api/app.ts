import cors from "cors";
import express from "express";

import { adminRouter } from "./routes/admin";
import { publicRouter } from "./routes/public";

function getAllowedOrigins() {
  return [process.env.NEXTAUTH_URL]
    .filter((value): value is string => Boolean(value))
    .filter((value, index, array) => array.indexOf(value) === index);
}

export function createApiApp() {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(null, false);
      },
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

  return app;
}
