import { z } from "zod";

const requiredImage = z.string().min(1);
const nullableString = z.string().optional().or(z.literal(""));
const numericField = z.coerce.number().optional();

export const communityPostSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(20),
  authorName: z.string().min(3),
  authorEmail: z.string().email().optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal(""))
});

export const newsSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5),
  slug: z.string().min(3),
  content: z.string().min(30),
  image: requiredImage,
  author: z.string().min(3),
  categoryId: z.string().optional().or(z.literal("")),
  publishedAt: z.string().min(5)
});

export const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5),
  description: z.string().min(20),
  date: z.string().min(5),
  time: z.string().min(2),
  location: z.string().min(4),
  image: requiredImage,
  organizer: z.string().min(3),
  latitude: numericField,
  longitude: numericField
});

export const businessSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(20),
  address: z.string().min(5),
  phone: z.string().min(6),
  website: nullableString,
  instagram: nullableString,
  latitude: numericField,
  longitude: numericField,
  images: z.array(z.string().min(1)).min(1),
  categoryId: z.string().optional().or(z.literal(""))
});

export const tourismSpotSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(20),
  type: z.enum(["trilhas", "cachoeiras", "mirantes", "historico"]),
  difficulty: z.string().min(3),
  location: z.string().min(3),
  latitude: numericField,
  longitude: numericField,
  image: requiredImage
});

export const siteSettingsSchema = z.object({
  heroTitle: z.string().min(3),
  heroSubtitle: z.string().min(10),
  heroImage: requiredImage,
  seoImage: requiredImage,
  historyTitle: z.string().min(3),
  historyDescription: z.string().min(20),
  historyImage: requiredImage
});

export const moderatorSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().optional().or(z.literal("")),
    isActive: z.boolean().default(true)
  })
  .superRefine((value, context) => {
    if (!value.id && !value.password) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Senha obrigatoria para novo moderador"
      });
    }

    if (value.password && value.password.length > 0 && value.password.length < 6) {
      context.addIssue({
        code: z.ZodIssueCode.too_small,
        path: ["password"],
        minimum: 6,
        inclusive: true,
        type: "string",
        message: "Senha deve ter pelo menos 6 caracteres"
      });
    }
  });
