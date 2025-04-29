"use client";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Training = () => {
  const [trainings, setTrainings] = React.useState([]);

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const getTrainings = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/employee_training`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        console.log(responseData);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token]);

  React.useEffect(() => {
    getTrainings();
  }, [getTrainings]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2 
                    t:items-start gap-4 t:p-4 t:gap-8"
      >
        Training
      </div>
    </div>
  );
};

export default Training;
