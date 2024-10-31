"use client";

import React from "react";
import Logo from "@/components/global/Logo";
import { IoMenu } from "react-icons/io5";
import { SideNav as SideNavInterface } from "@/interface/NavInterface";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Nav: React.FC<SideNavInterface & { children: React.ReactNode }> = (
  props
) => {
  const [sideNavVisible, setSideNavVisible] = React.useState(false);

  const handleSideNavVisible = (type: "button" | "link") => {
    setSideNavVisible((prev) => {
      switch (type) {
        case "button":
          return !prev;
        case "link":
          // if link and laptop view, maintain side nav state
          return window.innerWidth >= 1024 ? prev : !prev;
      }
    });
  };

  const path = usePathname();

  const mappedLinks = props.navLinks.map((link) => {
    const activeLink =
      link.url === "" ? path === props.home : path.includes(link.url);

    return (
      <Link
        onClick={() => handleSideNavVisible("link")}
        key={link.label}
        href={`${props.home}${link.url}`}
        className={`p-4 rounded-md w-full flex flex-row items-center justify-start transition-all
                     gap-2 h-14 ${
                       activeLink
                         ? "bg-accent-purple/20 font-semibold hover:bg-accent-purple/40"
                         : "bg-white hover:bg-neutral-100"
                     }  ${sideNavVisible ? "justify-start" : "justify-center"}`}
      >
        <span
          className={`${activeLink ? "text-accent-blue" : "text-neutral-500"}`}
        >
          {link.icon}
        </span>
        <span
          className={`${activeLink ? "text-accent-blue" : "text-neutral-950"} ${
            sideNavVisible ? "l-s:flex" : "l-s:hidden"
          } transition-all truncate`}
        >
          {link.label}
        </span>
      </Link>
    );
  });

  return (
    <div className="w-full h-full flex flex-row items-start justify-center">
      {/* side nav */}
      <div
        className={`w-full h-full fixed top-0 left-0 bg-white flex flex-col items-center justify-start transition-all
                    t:w-6/12 t:max-w-6/12 t:min-w-6/12 z-50 border-r-[1px] overflow-hidden l-s:static
                    ${
                      sideNavVisible
                        ? "translate-x-0 l-s:translate-x-0 l-s:w-72 l-s:max-w-72 l-s:min-w-72"
                        : "-translate-x-full l-s:translate-x-0 l-s:w-24 l-s:max-w-24 l-s:min-w-24"
                    } `}
      >
        <div
          className={`w-full flex flex-row items-center p-4 border-b-[1px] h-16
                    ${sideNavVisible ? "justify-between" : "justify-center"}`}
        >
          <button
            onClick={() => handleSideNavVisible("button")}
            className="p-2 rounded-full hover:bg-accent-purple/20 transition-all bg-slate-100"
          >
            <IoMenu className="text-lg" />
          </button>

          <div
            className={`${
              sideNavVisible ? "visible" : "hidden"
            } transition-all`}
          >
            <Logo url={props.home} type="dark" />
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-start p-4 gap-2">
          {mappedLinks}
        </div>
      </div>

      {/* transparent black screen on tablet */}
      {sideNavVisible ? (
        <div
          className="w-full h-full hidden bg-neutral-900/20 fixed top-0 right-0 z-40
                  t:animate-fade t:flex l-s:hidden"
        />
      ) : null}

      <div className="w-full h-full flex flex-col items-center justify-start">
        {/* head nav */}
        <div className="w-full flex flex-row items-center justify-between p-4 bg-white border-b-[1px] h-16">
          <button
            onClick={() => handleSideNavVisible("button")}
            className="p-2 rounded-full hover:bg-accent-purple/20 transition-all l-s:hidden"
          >
            <IoMenu className="text-lg" />
          </button>

          <div className="w-8 h-8 min-w-8 min-h-8 bg-accent-purple rounded-full ml-auto"></div>
        </div>

        {/* main content */}
        <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Nav;
