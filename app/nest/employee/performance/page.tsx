"use client";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Performance = () => {
  const [performanceReviews, setPerformanceReviews] = React.useState([]);

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const getPerformanceReviews = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/employee_performance_review`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.performance_reviews) {
          setPerformanceReviews(responseData.performance_reviews);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token]);

  React.useEffect(() => {
    getPerformanceReviews();
  }, [getPerformanceReviews]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
      t:items-start t:p-4 gap-4 t:gap-8"
      ></div>
    </div>
  );
};

export default Performance;
