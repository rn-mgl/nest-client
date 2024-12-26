import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents | HR",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <>{children}</>;
};

export default RootLayout;
