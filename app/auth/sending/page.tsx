"use client";

import sending from "@/public/global/sending.svg";
import Logo from "@/src/components/global/Logo";
import useGlobalContext from "@/src/utils/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const Message = () => {
  const param = useSearchParams();
  const type = param.get("type");
  const url = process.env.URL;

  const message = {
    verification: {
      title: "We are sending your verification link",
      body: "Please check your email inbox and click on the link to complete your verification.",
    },
    default: {
      title: "We are sending your request",
      body: "Please check your email inbox.",
    },
  };

  const resendVerificationMail = async () => {
    try {
      const { token } = await getCSRFToken();

      if (token) {
        const { data } = await axios.post(
          `${url}/auth/verification-notification`,
          {},
          {
            headers: { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") },
            withCredentials: true,
          }
        );

        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start gap-2 text-center">
      <p className="font-bold t:text-lg">
        {message[type as keyof object]["title"]}
      </p>
      <p className="">{message[type as keyof object]["body"]}</p>
      {type === "verification" ? (
        <button
          onClick={resendVerificationMail}
          className="p-2 rounded-md bg-neutral-900 text-neutral-50 px-4 mt-4 font-bold"
        >
          Resend
        </button>
      ) : null}
    </div>
  );
};

const Sending = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-start bg-gradient-to-b from-accent-purple/50 to-accent-blue/20">
      <div className="w-full h-full flex flex-col items-start justify-start max-w-screen-l-l p-4">
        <Logo url="/" type="dark" />
        <div className="w-full h-full flex flex-col items-center justify-center pb-10">
          <div className="w-full max-w-96 animate-float">
            <Image
              src={sending}
              alt="sending"
              className="drop-shadow-md saturate-150 animate-fade"
            />
          </div>
          <Message />
        </div>
      </div>
    </div>
  );
};

export default Sending;
