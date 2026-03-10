import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "admin" | "moderator" | "business" | "resident" | "visitor";
    };
  }

  interface User {
    role: "admin" | "moderator" | "business" | "resident" | "visitor";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "admin" | "moderator" | "business" | "resident" | "visitor";
  }
}
