import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "base-credentials",
      name: "BaseCredentials",

      credentials: {
        token: { label: "Token", type: "text" },
        roles: { label: "Roles", type: "array" },
        current: { label: "Current", type: "text" },
        image: { label: "Image", type: "text" },
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials): Promise<any> {
        try {
          const user = {
            token: credentials?.token ?? "",
            roles: credentials?.roles.split(",") ?? [],
            current: credentials?.current ? parseInt(credentials?.current) : 0,
            image: credentials?.image === "null" ? null : credentials?.image,
          };
          return user;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },

    async session({ token, session }) {
      if (token.user) {
        session.user = token.user;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
