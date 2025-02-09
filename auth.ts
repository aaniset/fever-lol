import NextAuth from "next-auth";
import Email from "next-auth/providers/nodemailer";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import magicLinkTemplate from "@/lib/email/magic-link-email";
import { Adapter } from "next-auth/adapters";
import { Resend } from "resend";
const resend = new Resend(process.env.EMAIL_SERVER_PASSWORD);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [
    Google({
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60, // Magic links are valid for 10 min

      sendVerificationRequest: async ({ identifier, url }) => {
        const client = await db;
        const user = await client
          .db()
          .collection("users")
          .findOne({ email: identifier });
        const action = user?.emailVerified ? "SIGNIN" : "ACTIVATE";
        try {
          const { error } = await resend.emails.send({
            from: "Welcome to Fever.lol <onboarding@noreply.techwithdeep.com>",
            to: [identifier],
            subject:
              action === "SIGNIN"
                ? "Sign in to Your App"
                : "Activate Your Account",
            html: magicLinkTemplate(url, action),
          });

          if (error) {
            console.error("Error sending email:", error);
          }
        } catch (error) {
          console.error("Error sending email:", error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.sub || token.id;
        session.user.name = token.name;
        session.user.email = token.email || "";
        session.user.image = token.picture;
        session.user.currency = token.currency || null; // Add this line
      }

      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      const client = await db;
      const dbUser = await client
        .db()
        .collection("users")
        .findOne({ email: token.email });

      if (!dbUser) {
        if (user && user.id) {
          token.id = user.id;
        }
        return token;
      }

      return {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        currency: dbUser.currency,
        sub: dbUser._id.toString(),
      };
    },
  },
});
