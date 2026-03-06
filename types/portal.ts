export type CategoryKind = "news" | "business" | "community";
export type NewsCategorySlug =
  | "bairro"
  | "eventos"
  | "emprego"
  | "cultura"
  | "esporte"
  | "infraestrutura";
export type BusinessCategorySlug =
  | "bares"
  | "restaurantes"
  | "mercados"
  | "oficinas"
  | "servicos"
  | "comercio";
export type CommunityCategorySlug = "announcements" | "jobs" | "services" | "lost-items";
export type TourismKind = "trilhas" | "cachoeiras" | "mirantes" | "historico";
export type CommunityStatus = "pending" | "approved" | "rejected";
export type UserRole = "visitor" | "resident" | "business" | "admin";

export interface PortalCategory {
  id: string;
  name: string;
  slug: string;
  type: CategoryKind;
}

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
}

export interface PortalNews {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  author: string;
  category?: PortalCategory | null;
  publishedAt: string;
}

export interface PortalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  organizer: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface PortalBusiness {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  website?: string | null;
  instagram?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];
  category?: PortalCategory | null;
}

export interface PortalTourismSpot {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: TourismKind;
  difficulty: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  image: string;
}

export interface PortalCommunityPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail?: string | null;
  category?: PortalCategory | null;
  status: CommunityStatus;
  createdAt: string;
}

export interface PortalSiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  seoImage: string;
  historyTitle: string;
  historyDescription: string;
  historyImage: string;
}

export interface HomePageData {
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  news: PortalNews[];
  events: PortalEvent[];
  businesses: PortalBusiness[];
  tourismSpots: PortalTourismSpot[];
  communityPosts: PortalCommunityPost[];
  featuredHistory: {
    title: string;
    description: string;
    image: string;
  };
}

export interface SaveNewsInput {
  id?: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  author: string;
  categoryId?: string | null;
  publishedAt: string;
}

export interface SaveEventInput {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  organizer: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface SaveBusinessInput {
  id?: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  phone: string;
  website?: string | null;
  instagram?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];
  categoryId?: string | null;
}

export interface SaveTourismSpotInput {
  id?: string;
  name: string;
  slug: string;
  description: string;
  type: TourismKind;
  difficulty: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  image: string;
}

export interface CreateCommunityPostInput {
  title: string;
  content: string;
  authorName: string;
  authorEmail?: string | null;
  categoryId?: string | null;
}

export interface SaveSiteSettingsInput {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  seoImage: string;
  historyTitle: string;
  historyDescription: string;
  historyImage: string;
}
