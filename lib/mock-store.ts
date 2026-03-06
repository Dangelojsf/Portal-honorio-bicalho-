import {
  mockBusinesses,
  mockCategories,
  mockCommunityPosts,
  mockEvents,
  mockNews,
  mockTourismSpots,
  mockUsers
} from "./mock-data";
import { defaultSiteSettings } from "./site";
import type {
  PortalBusiness,
  PortalCategory,
  PortalCommunityPost,
  PortalEvent,
  PortalNews,
  PortalSiteSettings,
  PortalTourismSpot,
  PortalUser
} from "../types/portal";

export interface PortalStore {
  users: PortalUser[];
  categories: PortalCategory[];
  news: PortalNews[];
  events: PortalEvent[];
  businesses: PortalBusiness[];
  tourismSpots: PortalTourismSpot[];
  communityPosts: PortalCommunityPost[];
  siteSettings: PortalSiteSettings;
}

declare global {
  var __portalStore: PortalStore | undefined;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createStore(): PortalStore {
  return {
    users: clone(mockUsers),
    categories: clone(mockCategories),
    news: clone(mockNews),
    events: clone(mockEvents),
    businesses: clone(mockBusinesses),
    tourismSpots: clone(mockTourismSpots),
    communityPosts: clone(mockCommunityPosts),
    siteSettings: clone(defaultSiteSettings)
  };
}

export const portalStore = globalThis.__portalStore ?? createStore();

if (process.env.NODE_ENV !== "production") {
  globalThis.__portalStore = portalStore;
}

export function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
