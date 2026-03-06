import "dotenv/config";

import bcrypt from "bcryptjs";
import { CategoryType, ModerationStatus, PrismaClient, TourismType, UserRole } from "@prisma/client";

import {
  mockBusinesses,
  mockCategories,
  mockCommunityPosts,
  mockEvents,
  mockNews,
  mockTourismSpots
} from "../lib/mock-data";
import { defaultSiteSettings } from "../lib/site";

const prisma = new PrismaClient();

function categoryTypeFromSlug(type: string) {
  switch (type) {
    case "news":
      return CategoryType.NEWS;
    case "business":
      return CategoryType.BUSINESS;
    default:
      return CategoryType.COMMUNITY;
  }
}

function tourismTypeToPrisma(type: string) {
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

function communityStatusToPrisma(status: string) {
  switch (status) {
    case "approved":
      return ModerationStatus.APPROVED;
    case "rejected":
      return ModerationStatus.REJECTED;
    default:
      return ModerationStatus.PENDING;
  }
}

async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "admin1234", 10);

  await prisma.communityPost.deleteMany();
  await prisma.news.deleteMany();
  await prisma.event.deleteMany();
  await prisma.business.deleteMany();
  await prisma.tourismSpot.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      id: "user-admin",
      name: "Equipe Portal Honorio Bicalho",
      email: process.env.ADMIN_EMAIL ?? "admin@portalhonoriobicalho.com.br",
      passwordHash,
      role: UserRole.ADMIN
    }
  });

  await prisma.user.create({
    data: {
      id: "user-moradora-luana",
      name: "Luana Oliveira",
      email: "luana@exemplo.com",
      passwordHash,
      role: UserRole.RESIDENT
    }
  });

  for (const category of mockCategories) {
    await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        type: categoryTypeFromSlug(category.type)
      }
    });
  }

  for (const item of mockNews) {
    await prisma.news.create({
      data: {
        id: item.id,
        title: item.title,
        slug: item.slug,
        content: item.content,
        image: item.image,
        author: item.author,
        publishedAt: new Date(item.publishedAt),
        categoryId: item.category?.id
      }
    });
  }

  for (const item of mockEvents) {
    await prisma.event.create({
      data: {
        id: item.id,
        title: item.title,
        description: item.description,
        date: new Date(item.date),
        time: item.time,
        location: item.location,
        image: item.image,
        organizer: item.organizer,
        latitude: item.latitude,
        longitude: item.longitude
      }
    });
  }

  for (const item of mockBusinesses) {
    await prisma.business.create({
      data: {
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
        categoryId: item.category?.id
      }
    });
  }

  for (const item of mockTourismSpots) {
    await prisma.tourismSpot.create({
      data: {
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        type: tourismTypeToPrisma(item.type),
        difficulty: item.difficulty,
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
        image: item.image
      }
    });
  }

  for (const item of mockCommunityPosts) {
    await prisma.communityPost.create({
      data: {
        id: item.id,
        title: item.title,
        content: item.content,
        authorName: item.authorName,
        authorEmail: item.authorEmail,
        categoryId: item.category?.id,
        status: communityStatusToPrisma(item.status),
        createdAt: new Date(item.createdAt),
        authorId: item.authorName === "Luana Oliveira" ? "user-moradora-luana" : "user-admin"
      }
    });
  }

  await prisma.siteSettings.create({
    data: {
      id: "site-settings",
      heroTitle: defaultSiteSettings.heroTitle,
      heroSubtitle: defaultSiteSettings.heroSubtitle,
      heroImage: defaultSiteSettings.heroImage,
      seoImage: defaultSiteSettings.seoImage,
      historyTitle: defaultSiteSettings.historyTitle,
      historyDescription: defaultSiteSettings.historyDescription,
      historyImage: defaultSiteSettings.historyImage
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
