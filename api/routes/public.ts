import { Router } from "express";

import {
  createCommunityPost,
  getBusinesses,
  getCommunityPosts,
  getEvents,
  getHomePageData,
  getLatestNews,
  getMapPoints,
  getNewsBySlug,
  getTourismSpots
} from "../../lib/repositories";
import { communityPostSchema } from "../../lib/validators";

export const publicRouter = Router();

publicRouter.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "portal-honorio-bicalho-api",
    date: new Date().toISOString()
  });
});

publicRouter.get("/api/home", async (_request, response, next) => {
  try {
    response.json(await getHomePageData());
  } catch (error) {
    next(error);
  }
});

publicRouter.get("/api/news", async (request, response, next) => {
  try {
    const limit = request.query.limit ? Number(request.query.limit) : undefined;
    response.json(await getLatestNews(limit));
  } catch (error) {
    next(error);
  }
});

publicRouter.get("/api/news/:slug", async (request, response, next) => {
  try {
    const news = await getNewsBySlug(request.params.slug);
    if (!news) {
      response.status(404).json({ error: "Noticia nao encontrada" });
      return;
    }

    response.json(news);
  } catch (error) {
    next(error);
  }
});

publicRouter.get("/api/events", async (_request, response, next) => {
  try {
    response.json(await getEvents());
  } catch (error) {
    next(error);
  }
});

publicRouter.get("/api/businesses", async (_request, response, next) => {
  try {
    response.json(await getBusinesses());
  } catch (error) {
    next(error);
  }
});

publicRouter.get("/api/tourism", async (_request, response, next) => {
  try {
    response.json(await getTourismSpots());
  } catch (error) {
    next(error);
  }
});

publicRouter.get("/api/community", async (request, response, next) => {
  try {
    const status = typeof request.query.status === "string" ? request.query.status : undefined;
    const normalizedStatus =
      status === "pending" || status === "approved" || status === "rejected" ? status : undefined;
    response.json(await getCommunityPosts(normalizedStatus));
  } catch (error) {
    next(error);
  }
});

publicRouter.post("/api/community", async (request, response, next) => {
  try {
    const parsed = communityPostSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        error: "Dados invalidos",
        details: parsed.error.flatten()
      });
      return;
    }

    const created = await createCommunityPost({
      title: parsed.data.title,
      content: parsed.data.content,
      authorName: parsed.data.authorName,
      authorEmail: parsed.data.authorEmail || null,
      categoryId: parsed.data.categoryId || null
    });

    response.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

publicRouter.get("/api/map", async (_request, response, next) => {
  try {
    response.json(await getMapPoints());
  } catch (error) {
    next(error);
  }
});
