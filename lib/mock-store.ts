import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";

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
  PortalAuditLog,
  PortalBusiness,
  PortalCategory,
  PortalCommunityPost,
  PortalEvent,
  PortalNews,
  PortalSiteSettings,
  PortalTourismSpot,
  StoredPortalUser
} from "../types/portal";

export interface PortalStore {
  users: StoredPortalUser[];
  categories: PortalCategory[];
  news: PortalNews[];
  events: PortalEvent[];
  businesses: PortalBusiness[];
  tourismSpots: PortalTourismSpot[];
  communityPosts: PortalCommunityPost[];
  siteSettings: PortalSiteSettings;
  auditLogs: PortalAuditLog[];
}

declare global {
  var __portalStore: PortalStore | undefined;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const storeFilePath = join(process.cwd(), "data", "portal-store.json");
let hasWarnedPersistenceFailure = false;

function createDefaultStore(): PortalStore {
  return {
    users: clone(mockUsers),
    categories: clone(mockCategories),
    news: clone(mockNews),
    events: clone(mockEvents),
    businesses: clone(mockBusinesses),
    tourismSpots: clone(mockTourismSpots),
    communityPosts: clone(mockCommunityPosts),
    siteSettings: clone(defaultSiteSettings),
    auditLogs: []
  };
}

function normalizeStore(value: Partial<PortalStore> | null | undefined): PortalStore {
  const defaults = createDefaultStore();

  if (!value) {
    return defaults;
  }

  return {
    users: Array.isArray(value.users)
      ? clone(value.users).map((item) => ({
          ...item,
          image: item.image ?? null,
          isActive: item.isActive ?? true,
          passwordHash: item.passwordHash ?? null
        }))
      : defaults.users,
    categories: Array.isArray(value.categories) ? clone(value.categories) : defaults.categories,
    news: Array.isArray(value.news) ? clone(value.news) : defaults.news,
    events: Array.isArray(value.events) ? clone(value.events) : defaults.events,
    businesses: Array.isArray(value.businesses) ? clone(value.businesses) : defaults.businesses,
    tourismSpots: Array.isArray(value.tourismSpots) ? clone(value.tourismSpots) : defaults.tourismSpots,
    communityPosts: Array.isArray(value.communityPosts) ? clone(value.communityPosts) : defaults.communityPosts,
    siteSettings: value.siteSettings ? { ...defaults.siteSettings, ...clone(value.siteSettings) } : defaults.siteSettings,
    auditLogs: Array.isArray(value.auditLogs) ? clone(value.auditLogs) : defaults.auditLogs
  };
}

function writeStoreToDisk(store: PortalStore) {
  try {
    mkdirSync(dirname(storeFilePath), { recursive: true });
    writeFileSync(storeFilePath, JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch (error) {
    if (!hasWarnedPersistenceFailure) {
      hasWarnedPersistenceFailure = true;
      console.warn("[mock-store] Persistencia em disco indisponivel. O fallback seguira apenas em memoria.");
      console.warn(error);
    }

    return false;
  }
}

function readStoreFromDisk() {
  if (!existsSync(storeFilePath)) {
    return null;
  }

  try {
    const raw = readFileSync(storeFilePath, "utf8");
    return normalizeStore(JSON.parse(raw) as Partial<PortalStore>);
  } catch {
    return null;
  }
}

function createStore(): PortalStore {
  const stored = readStoreFromDisk();
  const store = stored ?? createDefaultStore();

  if (!stored) {
    writeStoreToDisk(store);
  }

  return store;
}

export const portalStore = globalThis.__portalStore ?? createStore();

if (process.env.NODE_ENV !== "production") {
  globalThis.__portalStore = portalStore;
}

export function persistPortalStore() {
  writeStoreToDisk(portalStore);
}

export function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
