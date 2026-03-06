import { CategoryType, ModerationStatus, TourismType, UserRole } from "@prisma/client";

import { portalStore, generateId } from "./mock-store";
import { prisma } from "./prisma";
import { defaultSiteSettings } from "./site";
import type {
  CategoryKind,
  CreateCommunityPostInput,
  HomePageData,
  PortalBusiness,
  PortalCategory,
  PortalCommunityPost,
  PortalEvent,
  PortalNews,
  PortalSiteSettings,
  PortalTourismSpot,
  PortalUser,
  SaveBusinessInput,
  SaveEventInput,
  SaveNewsInput,
  SaveSiteSettingsInput,
  SaveTourismSpotInput
} from "../types/portal";

type AuthenticatedPortalUser = PortalUser & {
  image: string | null;
  passwordHash: string | null;
};

function categoryTypeToPortal(type: CategoryType): CategoryKind {
  switch (type) {
    case CategoryType.NEWS:
      return "news";
    case CategoryType.BUSINESS:
      return "business";
    default:
      return "community";
  }
}

function categoryTypeToPrisma(type: CategoryKind): CategoryType {
  switch (type) {
    case "news":
      return CategoryType.NEWS;
    case "business":
      return CategoryType.BUSINESS;
    default:
      return CategoryType.COMMUNITY;
  }
}

function tourismTypeToPortal(type: TourismType) {
  switch (type) {
    case TourismType.TRILHAS:
      return "trilhas" as const;
    case TourismType.CACHOEIRAS:
      return "cachoeiras" as const;
    case TourismType.MIRANTES:
      return "mirantes" as const;
    default:
      return "historico" as const;
  }
}

function moderationStatusToPortal(status: ModerationStatus) {
  switch (status) {
    case ModerationStatus.APPROVED:
      return "approved" as const;
    case ModerationStatus.REJECTED:
      return "rejected" as const;
    default:
      return "pending" as const;
  }
}

function moderationStatusToPrisma(status: PortalCommunityPost["status"]) {
  switch (status) {
    case "approved":
      return ModerationStatus.APPROVED;
    case "rejected":
      return ModerationStatus.REJECTED;
    default:
      return ModerationStatus.PENDING;
  }
}

function tourismTypeToPrisma(type: SaveTourismSpotInput["type"]) {
  switch (type) {
    case "trilhas":
      return TourismType.TRILHAS;
    case "cachoeiras":
      return TourismType.CACHOEIRAS;
    case "mirantes":
      return TourismType.MIRANTES;
    default:
      return TourismType.HISTORICO;
  }
}

function userRoleToPortal(role: UserRole): PortalUser["role"] {
  switch (role) {
    case UserRole.ADMIN:
      return "admin";
    case UserRole.BUSINESS:
      return "business";
    case UserRole.RESIDENT:
      return "resident";
    default:
      return "visitor";
  }
}

function mapCategory(category?: {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
} | null): PortalCategory | null {
  if (!category) {
    return null;
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    type: categoryTypeToPortal(category.type)
  };
}

function mapNews(item: {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  author: string;
  publishedAt: Date;
  category?: {
    id: string;
    name: string;
    slug: string;
    type: CategoryType;
  } | null;
}): PortalNews {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    content: item.content,
    image: item.image,
    author: item.author,
    publishedAt: item.publishedAt.toISOString(),
    category: mapCategory(item.category)
  };
}

function mapEvent(item: {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  image: string;
  organizer: string;
  latitude: number | null;
  longitude: number | null;
}): PortalEvent {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    date: item.date.toISOString(),
    time: item.time,
    location: item.location,
    image: item.image,
    organizer: item.organizer,
    latitude: item.latitude,
    longitude: item.longitude
  };
}

function mapBusiness(item: {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  website: string | null;
  instagram: string | null;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
    type: CategoryType;
  } | null;
}): PortalBusiness {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    address: item.address,
    phone: item.phone,
    website: item.website,
    instagram: item.instagram,
    latitude: item.latitude,
    longitude: item.longitude,
    images: item.images,
    category: mapCategory(item.category)
  };
}

function mapTourismSpot(item: {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: TourismType;
  difficulty: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  image: string;
}): PortalTourismSpot {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    type: tourismTypeToPortal(item.type),
    difficulty: item.difficulty,
    location: item.location,
    latitude: item.latitude,
    longitude: item.longitude,
    image: item.image
  };
}

function mapCommunityPost(item: {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string | null;
  status: ModerationStatus;
  createdAt: Date;
  category?: {
    id: string;
    name: string;
    slug: string;
    type: CategoryType;
  } | null;
}): PortalCommunityPost {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    authorName: item.authorName,
    authorEmail: item.authorEmail,
    status: moderationStatusToPortal(item.status),
    createdAt: item.createdAt.toISOString(),
    category: mapCategory(item.category)
  };
}

function mapSiteSettings(item: {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  seoImage: string;
  historyTitle: string;
  historyDescription: string;
  historyImage: string;
}): PortalSiteSettings {
  return {
    heroTitle: item.heroTitle,
    heroSubtitle: item.heroSubtitle,
    heroImage: item.heroImage,
    seoImage: item.seoImage,
    historyTitle: item.historyTitle,
    historyDescription: item.historyDescription,
    historyImage: item.historyImage
  };
}

async function withFallback<T>(loader: () => Promise<T>, fallback: () => T | Promise<T>) {
  if (!process.env.DATABASE_URL) {
    return fallback();
  }

  try {
    return await loader();
  } catch {
    return fallback();
  }
}

function getCategoryFromStore(categoryId?: string | null) {
  return portalStore.categories.find((item) => item.id === categoryId) ?? null;
}

function sortByDateDesc<T extends { publishedAt?: string; createdAt?: string; date?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const left = new Date(a.publishedAt ?? a.createdAt ?? a.date ?? 0).getTime();
    const right = new Date(b.publishedAt ?? b.createdAt ?? b.date ?? 0).getTime();
    return right - left;
  });
}

export async function getCategories(type?: CategoryKind) {
  return withFallback(
    async () => {
      const items = await prisma.category.findMany({
        where: type ? { type: categoryTypeToPrisma(type) } : undefined,
        orderBy: [{ type: "asc" }, { name: "asc" }]
      });

      return items.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        type: categoryTypeToPortal(item.type)
      }));
    },
    () =>
      portalStore.categories
        .filter((item) => (type ? item.type === type : true))
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
  );
}

export async function getUsers() {
  return withFallback(
    async () => {
      const items = await prisma.user.findMany({ orderBy: { name: "asc" } });
      return items.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        role: userRoleToPortal(item.role),
        image: item.image
      }));
    },
    () => [...portalStore.users]
  );
}

export async function findUserByEmail(email: string) {
  return withFallback<AuthenticatedPortalUser | null>(
    async () => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userRoleToPortal(user.role),
        image: user.image,
        passwordHash: user.passwordHash
      };
    },
    () => {
      const fallback = portalStore.users.find((item) => item.email === email);
      if (!fallback) {
        return null;
      }

      return {
        ...fallback,
        image: fallback.image ?? null,
        passwordHash: null
      };
    }
  );
}

export async function getLatestNews(limit?: number) {
  return withFallback(
    async () => {
      const items = await prisma.news.findMany({
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        take: limit
      });
      return items.map(mapNews);
    },
    () => sortByDateDesc(portalStore.news).slice(0, limit ?? portalStore.news.length)
  );
}

export async function getNewsBySlug(slug: string) {
  return withFallback(
    async () => {
      const item = await prisma.news.findUnique({
        where: { slug },
        include: { category: true }
      });
      return item ? mapNews(item) : null;
    },
    () => portalStore.news.find((item) => item.slug === slug) ?? null
  );
}

export async function getEvents() {
  return withFallback(
    async () => {
      const items = await prisma.event.findMany({ orderBy: { date: "asc" } });
      return items.map(mapEvent);
    },
    () => [...portalStore.events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  );
}

export async function getBusinesses() {
  return withFallback(
    async () => {
      const items = await prisma.business.findMany({
        include: { category: true },
        orderBy: { name: "asc" }
      });
      return items.map(mapBusiness);
    },
    () => [...portalStore.businesses].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
  );
}

export async function getTourismSpots() {
  return withFallback(
    async () => {
      const items = await prisma.tourismSpot.findMany({ orderBy: { name: "asc" } });
      return items.map(mapTourismSpot);
    },
    () => [...portalStore.tourismSpots].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
  );
}

export async function getCommunityPosts(status?: PortalCommunityPost["status"]) {
  return withFallback(
    async () => {
      const items = await prisma.communityPost.findMany({
        where: status ? { status: moderationStatusToPrisma(status) } : undefined,
        include: { category: true },
        orderBy: { createdAt: "desc" }
      });
      return items.map(mapCommunityPost);
    },
    () => {
      const filtered = status
        ? portalStore.communityPosts.filter((item) => item.status === status)
        : portalStore.communityPosts;

      return sortByDateDesc(filtered);
    }
  );
}

export async function getSiteSettings() {
  return withFallback(
    async () => {
      const settings = await prisma.siteSettings.findUnique({
        where: { id: "site-settings" }
      });

      return settings ? mapSiteSettings(settings) : defaultSiteSettings;
    },
    () => portalStore.siteSettings
  );
}

export async function getHomePageData(): Promise<HomePageData> {
  const [news, events, businesses, tourismSpots, communityPosts, siteSettings] = await Promise.all([
    getLatestNews(3),
    getEvents(),
    getBusinesses(),
    getTourismSpots(),
    getCommunityPosts("approved"),
    getSiteSettings()
  ]);

  return {
    hero: {
      title: siteSettings.heroTitle,
      subtitle: siteSettings.heroSubtitle,
      image: siteSettings.heroImage
    },
    news,
    events: events.slice(0, 3),
    businesses: businesses.slice(0, 6),
    tourismSpots: tourismSpots.slice(0, 4),
    communityPosts: communityPosts.slice(0, 3),
    featuredHistory: {
      title: siteSettings.historyTitle,
      description: siteSettings.historyDescription,
      image: siteSettings.historyImage
    }
  };
}

export async function getMapPoints() {
  const [businesses, tourismSpots, events] = await Promise.all([
    getBusinesses(),
    getTourismSpots(),
    getEvents()
  ]);

  return {
    businesses: businesses.filter((item) => item.latitude && item.longitude),
    tourismSpots: tourismSpots.filter((item) => item.latitude && item.longitude),
    events: events.filter((item) => item.latitude && item.longitude)
  };
}

export async function saveNews(input: SaveNewsInput) {
  return withFallback(
    async () => {
      const saved = await prisma.news.upsert({
        where: { slug: input.slug },
        update: {
          title: input.title,
          content: input.content,
          image: input.image,
          author: input.author,
          publishedAt: new Date(input.publishedAt),
          categoryId: input.categoryId || null
        },
        create: {
          id: input.id ?? generateId("news"),
          title: input.title,
          slug: input.slug,
          content: input.content,
          image: input.image,
          author: input.author,
          publishedAt: new Date(input.publishedAt),
          categoryId: input.categoryId || null
        },
        include: { category: true }
      });

      return mapNews(saved);
    },
    () => {
      const index = portalStore.news.findIndex((item) => item.id === input.id || item.slug === input.slug);
      const nextItem: PortalNews = {
        id: index >= 0 ? portalStore.news[index].id : input.id ?? generateId("news"),
        title: input.title,
        slug: input.slug,
        content: input.content,
        image: input.image,
        author: input.author,
        category: getCategoryFromStore(input.categoryId),
        publishedAt: input.publishedAt
      };

      if (index >= 0) {
        portalStore.news[index] = nextItem;
      } else {
        portalStore.news.unshift(nextItem);
      }

      return nextItem;
    }
  );
}

export async function deleteNews(id: string) {
  return withFallback(
    async () => {
      await prisma.news.delete({ where: { id } });
      return true;
    },
    () => {
      const index = portalStore.news.findIndex((item) => item.id === id);
      if (index >= 0) {
        portalStore.news.splice(index, 1);
      }
      return true;
    }
  );
}

export async function saveEvent(input: SaveEventInput) {
  return withFallback(
    async () => {
      const saved = await prisma.event.upsert({
        where: { id: input.id ?? generateId("event") },
        update: {
          title: input.title,
          description: input.description,
          date: new Date(input.date),
          time: input.time,
          location: input.location,
          image: input.image,
          organizer: input.organizer,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null
        },
        create: {
          id: input.id ?? generateId("event"),
          title: input.title,
          description: input.description,
          date: new Date(input.date),
          time: input.time,
          location: input.location,
          image: input.image,
          organizer: input.organizer,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null
        }
      });
      return mapEvent(saved);
    },
    () => {
      const id = input.id ?? generateId("event");
      const index = portalStore.events.findIndex((item) => item.id === id);
      const nextItem: PortalEvent = {
        id,
        title: input.title,
        description: input.description,
        date: input.date,
        time: input.time,
        location: input.location,
        image: input.image,
        organizer: input.organizer,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null
      };

      if (index >= 0) {
        portalStore.events[index] = nextItem;
      } else {
        portalStore.events.push(nextItem);
      }

      return nextItem;
    }
  );
}

export async function deleteEvent(id: string) {
  return withFallback(
    async () => {
      await prisma.event.delete({ where: { id } });
      return true;
    },
    () => {
      const index = portalStore.events.findIndex((item) => item.id === id);
      if (index >= 0) {
        portalStore.events.splice(index, 1);
      }
      return true;
    }
  );
}

export async function saveBusiness(input: SaveBusinessInput) {
  return withFallback(
    async () => {
      const saved = await prisma.business.upsert({
        where: { slug: input.slug },
        update: {
          name: input.name,
          description: input.description,
          address: input.address,
          phone: input.phone,
          website: input.website || null,
          instagram: input.instagram || null,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
          images: input.images,
          categoryId: input.categoryId || null
        },
        create: {
          id: input.id ?? generateId("business"),
          name: input.name,
          slug: input.slug,
          description: input.description,
          address: input.address,
          phone: input.phone,
          website: input.website || null,
          instagram: input.instagram || null,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
          images: input.images,
          categoryId: input.categoryId || null
        },
        include: { category: true }
      });
      return mapBusiness(saved);
    },
    () => {
      const index = portalStore.businesses.findIndex((item) => item.id === input.id || item.slug === input.slug);
      const nextItem: PortalBusiness = {
        id: index >= 0 ? portalStore.businesses[index].id : input.id ?? generateId("business"),
        name: input.name,
        slug: input.slug,
        description: input.description,
        address: input.address,
        phone: input.phone,
        website: input.website || null,
        instagram: input.instagram || null,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        images: input.images,
        category: getCategoryFromStore(input.categoryId)
      };

      if (index >= 0) {
        portalStore.businesses[index] = nextItem;
      } else {
        portalStore.businesses.push(nextItem);
      }

      return nextItem;
    }
  );
}

export async function deleteBusiness(id: string) {
  return withFallback(
    async () => {
      await prisma.business.delete({ where: { id } });
      return true;
    },
    () => {
      const index = portalStore.businesses.findIndex((item) => item.id === id);
      if (index >= 0) {
        portalStore.businesses.splice(index, 1);
      }
      return true;
    }
  );
}

export async function saveTourismSpot(input: SaveTourismSpotInput) {
  return withFallback(
    async () => {
      const saved = await prisma.tourismSpot.upsert({
        where: { slug: input.slug },
        update: {
          name: input.name,
          description: input.description,
          type: tourismTypeToPrisma(input.type),
          difficulty: input.difficulty,
          location: input.location,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
          image: input.image
        },
        create: {
          id: input.id ?? generateId("spot"),
          name: input.name,
          slug: input.slug,
          description: input.description,
          type: tourismTypeToPrisma(input.type),
          difficulty: input.difficulty,
          location: input.location,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
          image: input.image
        }
      });
      return mapTourismSpot(saved);
    },
    () => {
      const index = portalStore.tourismSpots.findIndex((item) => item.id === input.id || item.slug === input.slug);
      const nextItem: PortalTourismSpot = {
        id: index >= 0 ? portalStore.tourismSpots[index].id : input.id ?? generateId("spot"),
        name: input.name,
        slug: input.slug,
        description: input.description,
        type: input.type,
        difficulty: input.difficulty,
        location: input.location,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        image: input.image
      };

      if (index >= 0) {
        portalStore.tourismSpots[index] = nextItem;
      } else {
        portalStore.tourismSpots.push(nextItem);
      }

      return nextItem;
    }
  );
}

export async function deleteTourismSpot(id: string) {
  return withFallback(
    async () => {
      await prisma.tourismSpot.delete({ where: { id } });
      return true;
    },
    () => {
      const index = portalStore.tourismSpots.findIndex((item) => item.id === id);
      if (index >= 0) {
        portalStore.tourismSpots.splice(index, 1);
      }
      return true;
    }
  );
}

export async function saveSiteSettings(input: SaveSiteSettingsInput) {
  return withFallback(
    async () => {
      const saved = await prisma.siteSettings.upsert({
        where: { id: "site-settings" },
        update: {
          heroTitle: input.heroTitle,
          heroSubtitle: input.heroSubtitle,
          heroImage: input.heroImage,
          seoImage: input.seoImage,
          historyTitle: input.historyTitle,
          historyDescription: input.historyDescription,
          historyImage: input.historyImage
        },
        create: {
          id: "site-settings",
          heroTitle: input.heroTitle,
          heroSubtitle: input.heroSubtitle,
          heroImage: input.heroImage,
          seoImage: input.seoImage,
          historyTitle: input.historyTitle,
          historyDescription: input.historyDescription,
          historyImage: input.historyImage
        }
      });

      return mapSiteSettings(saved);
    },
    () => {
      portalStore.siteSettings = {
        heroTitle: input.heroTitle,
        heroSubtitle: input.heroSubtitle,
        heroImage: input.heroImage,
        seoImage: input.seoImage,
        historyTitle: input.historyTitle,
        historyDescription: input.historyDescription,
        historyImage: input.historyImage
      };

      return portalStore.siteSettings;
    }
  );
}

export async function createCommunityPost(input: CreateCommunityPostInput) {
  return withFallback(
    async () => {
      const saved = await prisma.communityPost.create({
        data: {
          id: generateId("community"),
          title: input.title,
          content: input.content,
          authorName: input.authorName,
          authorEmail: input.authorEmail || null,
          categoryId: input.categoryId || null,
          status: ModerationStatus.PENDING
        },
        include: { category: true }
      });
      return mapCommunityPost(saved);
    },
    () => {
      const nextItem: PortalCommunityPost = {
        id: generateId("community"),
        title: input.title,
        content: input.content,
        authorName: input.authorName,
        authorEmail: input.authorEmail || null,
        category: getCategoryFromStore(input.categoryId),
        status: "pending",
        createdAt: new Date().toISOString()
      };

      portalStore.communityPosts.unshift(nextItem);
      return nextItem;
    }
  );
}

export async function moderateCommunityPost(id: string, status: PortalCommunityPost["status"]) {
  return withFallback(
    async () => {
      const saved = await prisma.communityPost.update({
        where: { id },
        data: { status: moderationStatusToPrisma(status) },
        include: { category: true }
      });
      return mapCommunityPost(saved);
    },
    () => {
      const post = portalStore.communityPosts.find((item) => item.id === id);
      if (!post) {
        return null;
      }

      post.status = status;
      return post;
    }
  );
}

export async function deleteCommunityPost(id: string) {
  return withFallback(
    async () => {
      await prisma.communityPost.delete({ where: { id } });
      return true;
    },
    () => {
      const index = portalStore.communityPosts.findIndex((item) => item.id === id);
      if (index >= 0) {
        portalStore.communityPosts.splice(index, 1);
      }
      return true;
    }
  );
}

export async function getAdminSnapshot() {
  const [news, events, businesses, tourismSpots, communityPosts, categories, siteSettings] = await Promise.all([
    getLatestNews(),
    getEvents(),
    getBusinesses(),
    getTourismSpots(),
    getCommunityPosts(),
    getCategories(),
    getSiteSettings()
  ]);

  return {
    news,
    events,
    businesses,
    tourismSpots,
    communityPosts,
    categories,
    siteSettings,
    metrics: [
      { label: "Noticias", value: news.length.toString() },
      { label: "Eventos", value: events.length.toString() },
      { label: "Negocios", value: businesses.length.toString() },
      { label: "Pendentes", value: communityPosts.filter((item) => item.status === "pending").length.toString() }
    ]
  };
}
