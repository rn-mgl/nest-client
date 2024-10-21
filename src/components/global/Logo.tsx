import Image from "next/image";
import React from "react";
import logo from "@/public/global/logo.svg";

const Logo = () => {
  return (
    <div className="flex flex-row gap-1 items-center justify-center font-black">
      <div className="max-w-6">
        <Image src={logo} alt="logo" className="saturate-150" />
      </div>

      <p className="text-lg">Nest</p>
    </div>
  );
};

export default Logo;
