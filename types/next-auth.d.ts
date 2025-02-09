import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
  }
}

// declare module "next-auth" {
//   interface Session {
//     user: User & {
//       id: UserId;
//       currency: string | null;
//     };
//   }
// }

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      currency?: string | null | {};
    };
  }
}
