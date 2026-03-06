import type { NextFunction, Request, Response } from "express";

export function requireAdminToken(request: Request, response: Response, next: NextFunction) {
  const token =
    request.header("x-admin-token") ||
    request.header("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token || token !== process.env.ADMIN_API_TOKEN) {
    response.status(401).json({
      error: "Nao autorizado"
    });
    return;
  }

  next();
}
