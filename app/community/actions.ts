"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createCommunityPost } from "@/lib/repositories";
import { communityPostSchema } from "@/lib/validators";

export async function submitCommunityPostAction(formData: FormData) {
  const parsed = communityPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    authorName: formData.get("authorName"),
    authorEmail: formData.get("authorEmail"),
    categoryId: formData.get("categoryId")
  });

  if (!parsed.success) {
    redirect("/community?error=1");
  }

  await createCommunityPost({
    title: parsed.data.title,
    content: parsed.data.content,
    authorName: parsed.data.authorName,
    authorEmail: parsed.data.authorEmail || null,
    categoryId: parsed.data.categoryId || null
  });

  revalidatePath("/community");
  redirect("/community?submitted=1");
}
