import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type User as UserModel } from "@prisma/client";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { comparePassword } from "~/utils/password";

type UserRole = "admin" | "agent";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      // ...other properties
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User extends Omit<UserModel, "password" | "role"> {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: { signIn: "/signin" },
  adapter: PrismaAdapter(prisma),
  secret: env.JWT_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  callbacks: {
    redirect({ baseUrl }) {
      return `${baseUrl}/portal`;
    },

    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.picture = user.image;
        token.role = user.role;
      }

      return token;
    },

    session({ session, token }) {
      if (token) {
        session.user = {
          name: token.name,
          id: token.id,
          role: token.role,
          image: token.picture,
        };
      }

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Login with Email",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findFirst({
          where: {
            email: credentials?.username,
          },
        });

        if (!user) {
          return null;
        }

        const valid = await comparePassword(
          credentials?.password || "",
          user.password
        );

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          role: user.role as UserRole,
          image: user.image,
        };
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
