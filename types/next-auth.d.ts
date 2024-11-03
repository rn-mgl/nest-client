// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Session, User } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      token: string;
      role: string;
    };
  }

  interface User {
    token: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: {
      token: string;
      role: string;
    };
  }
}
