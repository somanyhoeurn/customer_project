import NextAuth, { getServerSession, type AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  loginService,
  isLoginSuccess,
} from "../service/auth/LoginService";

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        const userData = {
          username: credentials.username as string,
          password: credentials.password as string,
        };

        const loginResponse = await loginService(userData);

        if (!loginResponse || !isLoginSuccess(loginResponse)) {
          return null;
        }

        const data = loginResponse.data as {
          accessToken: string;
          user: { id: number; username: string; roles?: string[] };
        };
        const token = data.accessToken;
        const user = data.user;

        return {
          id: String(user.id),
          name: user.username,
          email: user.username,
          accessToken: token,
          roles: user.roles ?? [],
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.roles = user.roles;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roles = token.roles as string[] | undefined;
        session.accessToken = token.accessToken as string;
      }

      session.accessToken = token.accessToken as string;
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/customers`;
    },
  },
};

export async function auth() {
  return getServerSession(authOptions);
}

const handler = NextAuth(authOptions);

export const handlers = {
  GET: handler,
  POST: handler,
};