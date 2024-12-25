"use client";

import CreatePerformance from "@/src/components/hr/performance/CreatePerformance";
import DeletePerformance from "@/src/components/hr/performance/DeletePerformance";
import EditPerformance from "@/src/components/hr/performance/EditPerformance";
import ShowPerformance from "@/src/components/hr/performance/ShowPerformance";
import { PerformanceInterface } from "@/src/interface/PerformanceInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import useGlobalContext from "@/src/utils/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import {
  IoAdd,
  IoArrowForward,
  IoEllipsisVertical,
  IoPencil,
  IoTrash,
} from "react-icons/io5";

const Performance = () => {
  const [performances, setPerformances] = React.useState<
    Array<PerformanceInterface & UserInterface>
  >([]);
  const [canCreatePerformance, setCanCreatePerformance] = React.useState(false);
  const [activePerformanceMenu, setActivePerformanceMenu] = React.useState(0);
  const [activePerformanceSeeMore, setActivePerformanceSeeMore] =
    React.useState(0);
  const [canEditPerformance, setCanEditPerformance] = React.useState(false);
  const [canDeletePerformance, setCanDeletePerformance] = React.useState(false);

  const { url } = useGlobalContext();
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleCanCreatePerformance = () => {
    setCanCreatePerformance((prev) => !prev);
  };

  const handleActivePerformanceMenu = (id: number) => {
    setActivePerformanceMenu((prev) => (prev === id ? 0 : id));
  };

  const handleActivePerformanceSeeMore = (id: number) => {
    setActivePerformanceSeeMore((prev) => (prev === id ? 0 : id));
  };

  const handleCanEditPerformance = () => {
    setCanEditPerformance((prev) => !prev);
  };

  const handleCanDeletePerformance = () => {
    setCanDeletePerformance((prev) => !prev);
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

  const mappedPerformances = performances.map((performance, index) => {
    const activeMenu =
      activePerformanceMenu === performance.performance_review_id;
    const createdBy = performance.created_by === user?.current;
    return (
      <div
        key={index}
        className="w-full min-h-[17rem] p-4 rounded-md bg-neutral-100 flex 
                       flex-col items-center justify-start gap-4 relative max-w-full transition-all"
      >
        <div className="flex flex-row items-start justify-between w-full">
          <div className="flex flex-col items-start justify-start">
            <p className="font-bold truncate">{performance.title}</p>
          </div>

          <button
            onClick={() =>
              performance.performance_review_id &&
              handleActivePerformanceMenu(performance.performance_review_id)
            }
            className="p-2 rounded-full bg-neutral-100 transition-all"
          >
            <IoEllipsisVertical
              className={`${
                activeMenu ? "text-accent-blue" : "text-neutral-900"
              }`}
            />
          </button>
        </div>

        <div className="w-full h-40 max-h-40 min-h-40 flex flex-col items-center justify-start overflow-y-auto bg-neutral-200 p-2 rounded-sm">
          <p className="text-sm w-full text-wrap break-words">
            {performance.description}
          </p>
        </div>

        <button
          onClick={() =>
            performance.performance_review_id &&
            handleActivePerformanceSeeMore(performance.performance_review_id)
          }
          className="text-xs hover:underline transition-all underline-offset-2 flex flex-row items-center justify-start gap-1"
        >
          See More <IoArrowForward />
        </button>

        {activeMenu ? (
          <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
            <button
              onClick={handleCanEditPerformance}
              className="w-full p-1 rounded-sm text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoPencil className="text-accent-blue" />
              Edit
            </button>

            {createdBy ? (
              <button
                onClick={handleCanDeletePerformance}
                className="w-full p-1 rounded-sm text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
              >
                <IoTrash className="text-red-600" />
                Delete
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  });

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

      {canEditPerformance ? <EditPerformance /> : null}

      {canDeletePerformance ? <DeletePerformance /> : null}

      {activePerformanceSeeMore ? <ShowPerformance /> : null}
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

        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedPerformances}
        </div>
      </div>
    </div>
  );
};

export default Performance;
