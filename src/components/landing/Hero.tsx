import Link from "next/link";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";

const Hero = () => {
  return (
    <div
      className="w-full min-h-screen h-screen flex flex-col items-center justify-start 
                bg-accent-purple"
    >
      <div
        className="w-full h-full flex flex-col items-start justify-center max-w-screen-l-s text-left p-4 gap-8
                    t:items-center t:justify-start t:text-center "
      >
        <div className="w-full flex flex-col items-start justify-start gap-4 t:items-center t:justify-center mt-auto text-neutral-50">
          <p className="text-2xl font-extrabold t:text-3xl l-s:text-4xl l-l:text-5xl">
            <span className="text-accent-yellow">Empower</span> Employees,{" "}
            <br className="t:hidden" />
            <span className="text-accent-yellow">Elevate</span> Your Business
          </p>

          <p className="text-sm t:text-base l-s:text-lg">
            From user authentication to leave management, performance reviews,
            and everything in between; Nest helps you manage your workforce
            efficiently and effectively.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center w-full text-neutral-950 t:max-w-40 mb-auto t:flex-row t:gap-4">
          <Link
            href="/auth/register"
            className="w-full p-2.5 rounded-md font-bold bg-accent-yellow
                        hover:brightness-105 active:brightness-90 transition-all flex flex-row gap-2 items-center justify-center"
          >
            Start Now <HiMiniArrowTopRightOnSquare />
          </Link>
        </div>

        <div className="aspect-video w-full bg-white rounded-t-md t:max-w-screen-t"></div>
      </div>
    </div>
  );
};

export default Hero;
