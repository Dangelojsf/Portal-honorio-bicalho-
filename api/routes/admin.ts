import { Router } from "express";

import { requireAdminToken } from "../middleware/admin";
import {
  deleteBusiness,
  deleteCommunityPost,
  deleteEvent,
  deleteNews,
  deleteTourismSpot,
  getAdminSnapshot,
  moderateCommunityPost,
  saveBusiness,
  saveEvent,
  saveNews,
  saveTourismSpot
} from "../../lib/repositories";
import { businessSchema, eventSchema, newsSchema, tourismSpotSchema } from "../../lib/validators";

function normalizeImages(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export const adminRouter = Router();

adminRouter.use("/api/admin", requireAdminToken);

adminRouter.get("/api/admin/dashboard", async (_request, response, next) => {
  try {
    response.json(await getAdminSnapshot());
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/api/admin/news", async (request, response, next) => {
  try {
    const parsed = newsSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({ error: "Dados invalidos", details: parsed.error.flatten() });
      return;
    }

    response.json(await saveNews(parsed.data));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/api/admin/news/:id", async (request, response, next) => {
  try {
    await deleteNews(request.params.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/api/admin/events", async (request, response, next) => {
  try {
    const parsed = eventSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({ error: "Dados invalidos", details: parsed.error.flatten() });
      return;
    }

    response.json(await saveEvent(parsed.data));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/api/admin/events/:id", async (request, response, next) => {
  try {
    await deleteEvent(request.params.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/api/admin/businesses", async (request, response, next) => {
  try {
    const parsed = businessSchema.safeParse({
      ...request.body,
      images: normalizeImages(request.body.images)
    });

    if (!parsed.success) {
      response.status(400).json({ error: "Dados invalidos", details: parsed.error.flatten() });
      return;
    }

    response.json(await saveBusiness(parsed.data));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/api/admin/businesses/:id", async (request, response, next) => {
  try {
    await deleteBusiness(request.params.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/api/admin/tourism", async (request, response, next) => {
  try {
    const parsed = tourismSpotSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({ error: "Dados invalidos", details: parsed.error.flatten() });
      return;
    }

    response.json(await saveTourismSpot(parsed.data));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/api/admin/tourism/:id", async (request, response, next) => {
  try {
    await deleteTourismSpot(request.params.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

adminRouter.patch("/api/admin/community/:id", async (request, response, next) => {
  try {
    const status = request.body?.status;
    if (status !== "pending" && status !== "approved" && status !== "rejected") {
      response.status(400).json({ error: "Status invalido" });
      return;
    }

    response.json(await moderateCommunityPost(request.params.id, status));
  } catch (error) {
    next(error);
  }
});

adminRouter.delete("/api/admin/community/:id", async (request, response, next) => {
  try {
    await deleteCommunityPost(request.params.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});
