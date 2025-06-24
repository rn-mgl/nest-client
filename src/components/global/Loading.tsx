import React from "react";
import logo from "@/public/global/logo-dark.svg";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full backdrop-blur-md z-[60] flex items-center justify-center">
      <div className="p-2 rounded-lg bg-none w-10 shadow-lg animate-rotate relative overflow-hidden flex items-center justify-center">
        <div className="absolute bg-gradient-to-r from-accent-blue to-accent-yellow w-[200%] h-full z-0 animate-slide"></div>
        <Image src={logo} alt="logo" className="z-10" />
      </div>
    </div>
  );
};

export default Loading;
