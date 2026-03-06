import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPortalDate(value: string) {
  return format(new Date(value), "dd 'de' MMMM", { locale: ptBR });
}

export function formatPortalDateTime(value: string) {
  return format(new Date(value), "dd/MM/yyyy 'as' HH:mm", { locale: ptBR });
}

export function stripHtml(text: string) {
  return text.replace(/<[^>]*>/g, "");
}

export function createExcerpt(text: string, maxLength = 120) {
  const plain = stripHtml(text);
  if (plain.length <= maxLength) {
    return plain;
  }

  return `${plain.slice(0, maxLength).trimEnd()}...`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
