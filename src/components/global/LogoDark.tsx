import logo from "@/public/global/logo-dark.svg";
import Image from "next/image";
import Link from "next/link";

const LogoDark = () => {
  return (
    <div className="flex flex-row gap-1 items-center justify-center font-bold ">
      <Link href="/" className="w-6 t:w-8">
        <Image src={logo} alt="logo" />
      </Link>
    </div>
  );
};

export default LogoDark;
