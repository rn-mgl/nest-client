import darklogo from "@/public/global/logo-dark.svg";
import logo from "@/public/global/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { LogoNavInterface } from "@/interface/NavInterface";

const LogoNav: React.FC<LogoNavInterface> = (props) => {
  const type = props.type === "dark" ? darklogo : logo;
  const url = props.url ?? "/";

  return (
    <div className="flex flex-row gap-1 items-center justify-center font-bold ">
      <Link href={url} className="w-6 t:w-8">
        <Image src={type} alt="logo" />
      </Link>
    </div>
  );
};

export default LogoNav;
