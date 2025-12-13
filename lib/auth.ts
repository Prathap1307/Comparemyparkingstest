import { prisma } from "./prisma";
import { compare } from "bcryptjs";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
        if (!user || !user.passwordHash) return null;
        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.roleId } as unknown as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roleId = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.roleId = token.roleId as string | undefined;
      }
      return session;
    },
  },
};

export const { auth, handlers: { GET, POST }, signIn, signOut } = NextAuth(authConfig);
