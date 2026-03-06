import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "admin" | "business" | "resident" | "visitor";
    };
  }

  interface User {
    role: "admin" | "business" | "resident" | "visitor";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "admin" | "business" | "resident" | "visitor";
  }
}
