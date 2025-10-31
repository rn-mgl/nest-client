import React from "react";
import logo from "@/public/global/logo-dark.svg";
import Image from "next/image";

const LogoLoader = () => {
  return (
    <div className="w-full h-full fixed top-0 left-0 z-70 backdrop-blur-md flex flex-col items-center justify-center animate-fade">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-float">
          <Image src={logo} alt="logo" className="drop-shadow-md w-10" />
        </div>
      </div>
    </div>
  );
};

export default LogoLoader;
