"use client";

import React from "react";
import Logo from "@/components/global/Logo";
import { IoMenu } from "react-icons/io5";

const AdminNav = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [sideNavVisible, setSideNavVisible] = React.useState(false);

  const handleSideNavVisible = () => {
    setSideNavVisible((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-row items-center justify-start">
      {/* side nav */}
      <div
        className={`w-full h-full fixed top-0 left-0 bg-white flex flex-col items-center justify-start transition-all
                    t:w-6/12 t:max-w-6/12 t:min-w-6/12 z-50 border-r-[1px]
                    l-s:w-72 l-s:max-w-72 l-s:min-w-72
                    ${
                      sideNavVisible
                        ? "translate-x-0 l-s:translate-x-0"
                        : "-translate-x-full l-s:translate-x-0 l-s:w-20 l-s:max-w-20 l-s:min-w-20"
                    } `}
      >
        <div className="w-full flex flex-row items-center justify-between p-4 bg-white border-b-[1px] h-16">
          <button
            onClick={handleSideNavVisible}
            className="p-2 rounded-full hover:bg-accent-purple/20 transition-all"
          >
            <IoMenu className="text-lg" />
          </button>

          {sideNavVisible ? <Logo url="/nest/controller" type="dark" /> : null}
        </div>
      </div>

      {sideNavVisible ? (
        <div
          className="w-full h-full hidden bg-neutral-900/20 fixed top-0 right-0 z-40
                  t:animate-fade t:flex l-s:hidden"
        />
      ) : null}

      <div className="w-full flex flex-col items-center justify-start">
        {/* head nav */}
        <div className="w-full flex flex-row items-center justify-between p-4 bg-white border-b-[1px] h-16">
          <div className="hidden l-s:flex">
            <Logo url="/nest/controller" type="dark" />
          </div>

          <button
            onClick={handleSideNavVisible}
            className="p-2 rounded-full hover:bg-accent-purple/20 transition-all l-s:hidden"
          >
            <IoMenu className="text-lg" />
          </button>

          <div className="w-8 h-8 min-w-8 min-h-8 bg-accent-purple rounded-full"></div>
        </div>

        {/* main contenr */}
        {children}
      </div>
    </div>
  );
};

export default AdminNav;
