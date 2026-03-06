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
  saveSiteSettings,
  saveBusiness,
  saveEvent,
  saveNews,
  saveTourismSpot
} from "@/lib/repositories";
import { businessSchema, eventSchema, newsSchema, siteSettingsSchema, tourismSpotSchema } from "@/lib/validators";

async function ensureAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Nao autorizado");
  }
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

export async function saveNewsAction(formData: FormData) {
  await ensureAdmin();

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

  await saveNews(parsed.data);
  revalidatePortal(["/", "/news", "/admin"]);
}

export async function deleteNewsAction(formData: FormData) {
  await ensureAdmin();
  await deleteNews(getString(formData, "id"));
  revalidatePortal(["/", "/news", "/admin"]);
}

export async function saveEventAction(formData: FormData) {
  await ensureAdmin();

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

  await saveEvent(parsed.data);
  revalidatePortal(["/", "/events", "/admin"]);
}

export async function deleteEventAction(formData: FormData) {
  await ensureAdmin();
  await deleteEvent(getString(formData, "id"));
  revalidatePortal(["/", "/events", "/admin"]);
}

export async function saveBusinessAction(formData: FormData) {
  await ensureAdmin();

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

  await saveBusiness(parsed.data);
  revalidatePortal(["/", "/business-directory", "/admin"]);
}

export async function deleteBusinessAction(formData: FormData) {
  await ensureAdmin();
  await deleteBusiness(getString(formData, "id"));
  revalidatePortal(["/", "/business-directory", "/admin"]);
}

export async function saveTourismSpotAction(formData: FormData) {
  await ensureAdmin();

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

  await saveTourismSpot(parsed.data);
  revalidatePortal(["/", "/tourism", "/admin"]);
}

export async function deleteTourismSpotAction(formData: FormData) {
  await ensureAdmin();
  await deleteTourismSpot(getString(formData, "id"));
  revalidatePortal(["/", "/tourism", "/admin"]);
}

export async function approveCommunityPostAction(formData: FormData) {
  await ensureAdmin();
  await moderateCommunityPost(getString(formData, "id"), "approved");
  revalidatePortal(["/", "/community", "/admin"]);
}

export async function rejectCommunityPostAction(formData: FormData) {
  await ensureAdmin();
  await moderateCommunityPost(getString(formData, "id"), "rejected");
  revalidatePortal(["/community", "/admin"]);
}

export async function deleteCommunityPostAction(formData: FormData) {
  await ensureAdmin();
  await deleteCommunityPost(getString(formData, "id"));
  revalidatePortal(["/community", "/admin"]);
}

export async function saveSiteSettingsAction(formData: FormData) {
  await ensureAdmin();

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
  revalidatePortal(["/", "/history", "/admin"]);
}
