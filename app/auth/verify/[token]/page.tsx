"use client";

import useGlobalContext from "@/src/utils/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import React from "react";

const Verify = () => {
  const params = useParams();
  const candidateToken = params.token;
  const { url } = useGlobalContext();

  const verifyAccount = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken(url);

      if (token) {
        const { data: verify } = await axios.patch(
          `${url}/auth/verify`,
          { token: candidateToken },
          {
            headers: { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") },
            withCredentials: true,
          }
        );

        console.log(verify);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, candidateToken]);

  React.useEffect(() => {
    verifyAccount();
  }, [verifyAccount]);

  return <div>Verify</div>;
};

export default Verify;
