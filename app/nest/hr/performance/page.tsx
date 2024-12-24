"use client";

import CreatePerformance from "@/src/components/hr/performance/CreatePerformance";
import useGlobalContext from "@/src/utils/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const Performance = () => {
  const [canCreatePerformance, setCanCreatePerformance] = React.useState(false);
  const [performances, setPerformances] = React.useState([]);

  const { url } = useGlobalContext();
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleCanCreatePerformance = () => {
    setCanCreatePerformance((prev) => !prev);
  };

  const getPerformances = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken(url);

      if (token && user?.token) {
        const { data: allPerformances } = await axios.get(
          `${url}/hr/performance`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
            withCredentials: true,
          }
        );

        if (allPerformances.performances) {
          setPerformances(allPerformances.performances);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token]);

  React.useEffect(() => {
    getPerformances();
  }, [getPerformances]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreatePerformance ? (
        <CreatePerformance
          refetchIndex={getPerformances}
          toggleModal={handleCanCreatePerformance}
        />
      ) : null}
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-screen-l-l p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <button
          onClick={handleCanCreatePerformance}
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-fit t:px-4 transition-all"
        >
          Create Performance <IoAdd />
        </button>
      </div>
    </div>
  );
};

export default Performance;
