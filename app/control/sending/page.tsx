"use client";

import sending from "@/public/global/sending.svg";
import Logo from "@/src/components/global/Logo";
import useGlobalContext from "@/src/utils/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Message = () => {
  const params = useSearchParams();
  const type = params && params.get("type");
  const { url } = useGlobalContext();
  const route = useRouter();

  const message = {
    verification: {
      title: "We are sending the verification link",
      body: "Please advise the recipient to check their email inbox and click on the link to complete the verification.",
    },
    default: {
      title: "We are sending your request",
      body: "Please check your email inbox.",
    },
  };

  const resendVerification = async () => {
    try {
      const { token } = await getCSRFToken();

      if (token) {
        const { data } = await axios.post(
          `${url}/admin_auth/verification-notification`,
          {},
          {
            headers: { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") },
            withCredentials: true,
          }
        );

        if (data) {
          route.push("/control/login");
        }
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
          onClick={resendVerification}
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
    <div className="w-full h-screen flex flex-col items-center justify-start bg-linear-to-b from-accent-purple/50 to-accent-blue/30">
      <div className="w-full h-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) p-4">
        <Logo type="dark" url="/" />
        <div className="w-full h-full flex flex-col items-center justify-center pb-10">
          <div className="w-full max-w-96 animate-float">
            <Image
              src={sending}
              alt="sending"
              className="drop-shadow-md saturate-150 animate-fade"
            />
          </div>
          <Suspense>
            <Message />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Sending;
