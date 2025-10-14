// eslint-disable-next-line @typescript-eslint/no-unused-vars
import "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      token: string;
      role: Array<string>;
      current: number;
      image: null | string;
    };
  }

  interface User {
    token: string;
    role: Array<string>;
    current: number;
    image: null | string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: {
      token: string;
      role: Array<string>;
      current: number;
      image: null | string;
    };
  }
}
