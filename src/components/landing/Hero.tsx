import React from "react";
import Logo from "../global/Logo";

const Hero = () => {
  return (
    <div className="w-full min-h-screen h-screen flex flex-col items-center justify-start bg-accent-purple/20">
      <div
        className="w-full h-full flex flex-col items-start justify-center max-w-screen-l-s text-left p-4 gap-8
                    t:items-center t:justify-start t:text-center "
      >
        <Logo />

        <div className="w-full flex flex-col items-start justify-start gap-4 t:items-center t:justify-center mt-auto">
          <p className="text-2xl font-normal t:text-3xl l-s:text-4xl l-l:text-5xl">
            <span className="font-black">Empower</span> Employees,{" "}
            <br className="t:hidden" />{" "}
            <span className="font-black">Elevate</span> Your Business
          </p>

          <p className="text-sm t:text-base l-s:text-lg">
            From user authentication to leave management, performance reviews,
            and everything in between; Nest helps you manage your workforce
            efficiently and effectively.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-full text-neutral-950 t:max-w-40 mb-auto t:flex-row t:gap-4">
          <button
            className="w-full p-2.5 rounded-md font-bold bg-accent-yellow
                        hover:brightness-105 active:brightness-90 transition-all"
          >
            Start Now
          </button>
        </div>

        <div className="aspect-video w-full bg-white rounded-t-md t:max-w-screen-t"></div>
      </div>
    </div>
  );
};

export default Hero;
