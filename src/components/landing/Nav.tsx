import React from "react";
import Logo from "@/components/global/Logo";
import Link from "next/link";

const Nav = () => {
  return (
    <div className="w-full p-2 bg-neutral-50/70 flex flex-row items-center justify-center sticky top-0 t:p-4 backdrop-blur-xs">
      <div className="w-full flex flex-row items-center justify-between max-w-(--breakpoint-l-l)">
        <Logo url="/" type="dark" />

        <Link
          href="/auth/login"
          className="font-medium p-1.5 rounded-md px-2 bg-neutral-900 text-neutral-50 text-xs t:text-sm t:p-2 t:px-4
                    hover:brightness-90 active:brightness-90"
        >
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Nav;
