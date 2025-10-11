import React from "react";
import Logo from "@/global/navigation/Logo";
import Link from "next/link";

const Nav = () => {
  return (
    <div className="w-full p-2 bg-neutral-50/70 flex flex-row items-center justify-center fixed top-0 t:p-4 backdrop-blur-xs">
      <div className="w-full flex flex-row items-center justify-between gap-8 max-w-(--breakpoint-l-l)">
        <Logo url="#hero" type="dark" />

        <div className="w-full text-sm flex items-center justify-center gap-2 t:gap-8">
          <Link
            href="#about"
            className="hover:underline underline-offset-2 transition-all"
          >
            About
          </Link>
          <Link
            href="#offers"
            className="hover:underline underline-offset-2 transition-all"
          >
            Offers
          </Link>
          <Link
            href="#action"
            className="hover:underline underline-offset-2 transition-all"
          >
            Action
          </Link>
        </div>

        <Link
          href="/auth/login"
          className="font-medium p-1.5 rounded-md px-2 bg-neutral-900 text-neutral-50 text-xs t:text-sm t:p-2 t:px-4
                    hover:brightness-90 active:brightness-90 text-nowrap"
        >
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Nav;
