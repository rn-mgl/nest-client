"use client";

import Logo from "@/src/components/global/Logo";
import useGlobalContext from "@/src/utils/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import approved from "@/public/auth/approved.svg";
import error from "@/public/auth/error.svg";
import processing from "@/public/auth/processing.svg";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";

const Verify = () => {
  const [status, setStatus] = React.useState("processing");
  const params = useParams();
  const candidateToken = params.token;
  const { url } = useGlobalContext();

  const verifyAccount = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken(url);

      if (token) {
        const { data: verify } = await axios.patch(
          `${url}/admin_auth/verify`,
          { token: candidateToken },
          {
            headers: { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") },
            withCredentials: true,
          }
        );

        setStatus(verify ? "approved" : "error");
      }
    } catch (error) {
      setStatus("error");
      console.log(error);
    }
  }, [url, candidateToken]);

  React.useEffect(() => {
    verifyAccount();
  }, [verifyAccount]);

  return (
    <div className="w-full h-dvh flex flex-col items-center justify-start bg-gradient-to-b from-accent-blue/40 to-accent-yellow/40">
      <div className="w-full h-full flex flex-col items-start justify-between max-w-screen-l-l gap-4 p-4 t:p-8">
        <Logo url="/" type="dark" />
        <div className="w-full h-full flex flex-col items-center justify-center gap-8">
          <div className="w-full max-w-80 animate-float">
            {status === "error" ? (
              <Image
                src={error}
                alt="error"
                className="drop-shadow-md animate-fade"
              />
            ) : status === "approved" ? (
              <Image
                src={approved}
                alt="approved"
                className="drop-shadow-md saturate-150 animate-fade"
              />
            ) : (
              <Image
                src={processing}
                alt="processing"
                className="drop-shadow-md saturate-150 animate-fade"
              />
            )}
          </div>

          <div className="w-full flex flex-col items-center justify-center text-center text-neutral-950 font-semibold gap-2">
            {status === "error" ? (
              <p>
                There was a problem verifying your account. Try again or report
                to Nest.
              </p>
            ) : status === "approved" ? (
              <>
                <p>Your account is verified!</p>
                <Link
                  href="/control/login"
                  className="font-semibold flex flex-row items-center justify-center gap-2 p-2 bg-accent-purple text-accent-yellow rounded-full px-4"
                >
                  Proceed to Login <IoChevronForward />
                </Link>
              </>
            ) : (
              <p>Your account verification is being processed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
