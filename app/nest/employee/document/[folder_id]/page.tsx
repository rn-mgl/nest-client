"use client";

import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";

const Document = () => {
  const [documents, setDocuments] = React.useState([]);

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const params = useParams();
  const path = params?.path ?? 0;

  const getDocuments = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/document`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
            params: { path: path },
          }
        );

        console.log(responseData);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, path]);

  React.useEffect(() => {
    getDocuments();
  }, [getDocuments]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
                    t:items-start t:p-4 gap-4 t:gap-8"
      >
        asd
      </div>
    </div>
  );
};

export default Document;
