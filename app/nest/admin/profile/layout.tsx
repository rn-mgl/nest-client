import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Admin",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <>{children}</>;
};

export default RootLayout;
