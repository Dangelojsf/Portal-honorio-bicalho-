"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  deleteBusiness,
  deleteCommunityPost,
  deleteEvent,
  deleteNews,
  deleteTourismSpot,
  moderateCommunityPost,
  recordAuditLog,
  saveModerator,
  saveSiteSettings,
  saveBusiness,
  saveEvent,
  saveNews,
  saveTourismSpot
} from "@/lib/repositories";
import { businessSchema, eventSchema, moderatorSchema, newsSchema, siteSettingsSchema, tourismSpotSchema } from "@/lib/validators";

async function ensureRole(allowedRoles: Array<"admin" | "moderator">) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !allowedRoles.includes(session.user.role as "admin" | "moderator")) {
    throw new Error("Nao autorizado");
  }

  return session.user;
}

async function ensureAdmin() {
  return ensureRole(["admin"]);
}

async function ensureStaff() {
  return ensureRole(["admin", "moderator"]);
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key).trim();
  return value || undefined;
}

function getOptionalNumber(formData: FormData, key: string) {
  const value = getString(formData, key).trim();
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function getBoolean(formData: FormData, key: string) {
  return getString(formData, key) === "on";
}

function getImages(formData: FormData) {
  return getString(formData, "images")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function revalidatePortal(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

function actorFromUser(user: Awaited<ReturnType<typeof ensureRole>>) {
  return {
    actorId: user.id,
    actorName: user.name ?? user.email ?? "Equipe do portal",
    actorRole: user.role
  };
}

export async function saveNewsAction(formData: FormData) {
  const user = await ensureStaff();

  const parsed = newsSchema.safeParse({
    id: getOptionalString(formData, "id"),
    title: getString(formData, "title"),
    slug: getString(formData, "slug"),
    content: getString(formData, "content"),
    image: getString(formData, "image"),
    author: getString(formData, "author"),
    categoryId: getOptionalString(formData, "categoryId"),
    publishedAt: getString(formData, "publishedAt")
  });

  if (!parsed.success) {
    throw new Error("Dados invalidos para noticia");
  }

  const saved = await saveNews(parsed.data);
  await recordAuditLog({
    ...actorFromUser(user),
    entityType: "news",
    entityId: saved.id,
    entityTitle: saved.title,
    action: parsed.data.id ? "update" : "create",
    summary: `${user.name} ${parsed.data.id ? "atualizou" : "criou"} a noticia "${saved.title}".`,
    afterData: {
      title: saved.title,
      slug: saved.slug,
      author: saved.author,
      category: saved.category?.name ?? null
    }
  });
  revalidatePortal(["/", "/news", "/admin"]);
}

export async function deleteNewsAction(formData: FormData) {
  const user = await ensureStaff();
  const id = getString(formData, "id");
  const entityTitle = getOptionalString(formData, "entityTitle") ?? "Noticia";
  await deleteNews(id);
  await recordAuditLog({
    ...actorFromUser(user),
    entityType: "news",
    entityId: id,
    entityTitle,
    action: "delete",
    summary: `${user.name} excluiu a noticia "${entityTitle}".`
  });
  revalidatePortal(["/", "/news", "/admin"]);
}

export async function saveEventAction(formData: FormData) {
  const user = await ensureStaff();

  const parsed = eventSchema.safeParse({
    id: getOptionalString(formData, "id"),
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    date: getString(formData, "date"),
    time: getString(formData, "time"),
    location: getString(formData, "location"),
    image: getString(formData, "image"),
    organizer: getString(formData, "organizer"),
    latitude: getOptionalNumber(formData, "latitude"),
    longitude: getOptionalNumber(formData, "longitude")
  });

  if (!parsed.success) {
    throw new Error("Dados invalidos para evento");
  }

  const saved = await saveEvent(parsed.data);
  await recordAuditLog({
    ...actorFromUser(user),
    entityType: "event",
    entityId: saved.id,
    entityTitle: saved.title,
    action: parsed.data.id ? "update" : "create",
    summary: `${user.name} ${parsed.data.id ? "atualizou" : "criou"} o evento "${saved.title}".`,
    afterData: {
      title: saved.title,
      location: saved.location,
      date: saved.date,
      organizer: saved.organizer
    }
  });
  revalidatePortal(["/", "/events", "/admin"]);
}

export async function deleteEventAction(formData: FormData) {
  const user = await ensureStaff();
  const id = getString(formData, "id");
  const entityTitle = getOptionalString(formData, "entityTitle") ?? "Evento";
  await deleteEvent(id);
  await recordAuditLog({
    ...actorFromUser(user),
    entityType: "event",
    entityId: id,
    entityTitle,
    action: "delete",
    summary: `${user.name} excluiu o evento "${entityTitle}".`
  });
  revalidatePortal(["/", "/events", "/admin"]);
}

export async function saveBusinessAction(formData: FormData) {
  const user = await ensureStaff();

  const parsed = businessSchema.safeParse({
    id: getOptionalString(formData, "id"),
    name: getString(formData, "name"),
    slug: getString(formData, "slug"),
    description: getString(formData, "description"),
    address: getString(formData, "address"),
    phone: getString(formData, "phone"),
    website: getOptionalString(formData, "website"),
    instagram: getOptionalString(formData, "instagram"),
    latitude: getOptionalNumber(formData, "latitude"),
    longitude: getOptionalNumber(formData, "longitude"),
    images: getImages(formData),
    categoryId: getOptionalString(formData, "categoryId")
  });

  if (!parsed.success) {
    throw new Error("Dados invalidos para negocio");
  }

  const saved = await saveBusiness(parsed.data);
  await recordAuditLog({
    ...actorFromUser(user),
    entityType: "business",
    entityId: saved.id,
    entityTitle: saved.name,
    action: parsed.data.id ? "update" : "create",
    summary: `${user.name} ${parsed.data.id ? "atualizou" : "criou"} o negocio "${saved.name}".`,
    afterData: {
      name: saved.name,
      address: saved.address,
      phone: saved.phone,
      category: saved.category?.name ?? null
    }
  });
  revalidatePortal(["/", "/business-directory", "/admin"]);
}

export async function deleteBusinessAction(formData: FormData) {
  const user = await ensureStaff();
  const id = getString(formData, "id");
  const entityTitle = getOptionalString(formData, "entityTitle") ?? "Negocio";
  await deleteBusiness(id);
  await recordAuditLog({
    ...actorFromUser(user),
    entityType: "business",
    entityId: id,
    entityTitle,
    action: "delete",
    summary: `${user.name} excluiu o negocio "${entityTitle}".`
  });
  revalidatePortal(["/", "/business-directory", "/admin"]);
}

export async function saveTourismSpotAction(formData: FormData) {
  const user = await ensureStaff();

  const parsed = tourismSpotSchema.safeParse({
    id: getOptionalString(formData, "id"),
    name: getString(formData, "name"),
    slug: getString(formData, "slug"),
    description: getString(formData, "description"),
    type: getString(formData, "type"),
    difficulty: getString(formData, "difficulty"),
    location: getString(formData, "location"),
    latitude: getOptionalNumber(formData, "latitude"),
    longitude: getOptionalNumber(formData, "longitude"),
    image: getString(formData, "image")
  });

  if (!parsed.success) {
    throw new Error("Dados invalidos para ponto turistico");
  }

  const saved = await saveTourismSpot(parsed.data);
  await recordAuditLog({
    ...actorFromUser(user),
    entityType: "tourism",
    entityId: saved.id,
    entityTitle: saved.name,
    action: parsed.data.id ? "update" : "create",
    summary: `${user.name} ${parsed.data.id ? "atualizou" : "criou"} o ponto turistico "${saved.name}".`,
    afterData: {
      name: saved.name,
      location: saved.location,
      type: saved.type,
      difficulty: saved.difficulty
    }
  });
  revalidatePortal(["/", "/tourism", "/admin"]);
}

export async function deleteTourismSpotAction(formData: FormData) {
  const user = await ensureStaff();
  const id = getString(formData, "id");
  const entityTitle = getOptionalString(formData, "entityTitle") ?? "Ponto turistico";
  await deleteTourismSpot(id);
  await recordAuditLog({
    ...actorFromUser(user),
    entityType: "tourism",
    entityId: id,
    entityTitle,
    action: "delete",
    summary: `${user.name} excluiu o ponto turistico "${entityTitle}".`
  });
  revalidatePortal(["/", "/tourism", "/admin"]);
}

export async function approveCommunityPostAction(formData: FormData) {
  const user = await ensureStaff();
  const id = getString(formData, "id");
  const entityTitle = getOptionalString(formData, "entityTitle") ?? "Post da comunidade";
  await moderateCommunityPost(id, "approved");
  await recordAuditLog({
    ...actorFromUser(user),
    entityType: "community",
    entityId: id,
    entityTitle,
    action: "approve",
    summary: `${user.name} aprovou o post "${entityTitle}".`,
    afterData: { status: "approved" }
  });
  revalidatePortal(["/", "/community", "/admin"]);
}

export async function rejectCommunityPostAction(formData: FormData) {
  const user = await ensureStaff();
  const id = getString(formData, "id");
  const entityTitle = getOptionalString(formData, "entityTitle") ?? "Post da comunidade";
  await moderateCommunityPost(id, "rejected");
  await recordAuditLog({
    ...actorFromUser(user),
    entityType: "community",
    entityId: id,
    entityTitle,
    action: "reject",
    summary: `${user.name} rejeitou o post "${entityTitle}".`,
    afterData: { status: "rejected" }
  });
  revalidatePortal(["/community", "/admin"]);
}

export async function deleteCommunityPostAction(formData: FormData) {
  const user = await ensureStaff();
  const id = getString(formData, "id");
  const entityTitle = getOptionalString(formData, "entityTitle") ?? "Post da comunidade";
  await deleteCommunityPost(id);
  await recordAuditLog({
    ...actorFromUser(user),
    entityType: "community",
    entityId: id,
    entityTitle,
    action: "delete",
    summary: `${user.name} excluiu o post "${entityTitle}".`
  });
  revalidatePortal(["/community", "/admin"]);
}

export async function saveSiteSettingsAction(formData: FormData) {
  const user = await ensureAdmin();

  const parsed = siteSettingsSchema.safeParse({
    heroTitle: getString(formData, "heroTitle"),
    heroSubtitle: getString(formData, "heroSubtitle"),
    heroImage: getString(formData, "heroImage"),
    seoImage: getString(formData, "seoImage"),
    historyTitle: getString(formData, "historyTitle"),
    historyDescription: getString(formData, "historyDescription"),
    historyImage: getString(formData, "historyImage")
  });

  if (!parsed.success) {
    throw new Error("Dados invalidos para configuracao do portal");
  }

  await saveSiteSettings(parsed.data);
  await recordAuditLog({
    ...actorFromUser(user),
    entityType: "site-settings",
    entityId: "site-settings",
    entityTitle: "Configuracoes globais do portal",
    action: "update",
    summary: `${user.name} atualizou a aparencia global do portal.`,
    afterData: {
      heroTitle: parsed.data.heroTitle,
      historyTitle: parsed.data.historyTitle
    }
  });
  revalidatePortal(["/", "/history", "/admin"]);
}

export async function saveModeratorAction(formData: FormData) {
  const user = await ensureAdmin();

  const parsed = moderatorSchema.safeParse({
    id: getOptionalString(formData, "id"),
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    password: getOptionalString(formData, "password"),
    isActive: getBoolean(formData, "isActive")
  });

  if (!parsed.success) {
    throw new Error("Dados invalidos para moderador");
  }

  const saved = await saveModerator(parsed.data);
  await recordAuditLog({
    ...actorFromUser(user),
    entityType: "moderator",
    entityId: saved.id,
    entityTitle: saved.name,
    action: parsed.data.id ? "update" : "create",
    summary: `${user.name} ${parsed.data.id ? "atualizou" : "criou"} o moderador "${saved.name}".`,
    afterData: {
      email: saved.email,
      isActive: saved.isActive
    }
  });
  revalidatePortal(["/admin"]);
}
