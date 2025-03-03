// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // Should be `string` instead of `int`
    email: string;
    role: string;
    college: string?;
  }

  interface Session {
    user: User;
  }
}
