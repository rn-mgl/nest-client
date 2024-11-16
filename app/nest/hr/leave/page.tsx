"use client";

import CreateLeave from "@/src/components/hr/leave/CreateLeave";
import { LeaveType as LeaveTypeInterface } from "@/src/interface/LeaveInterface";
import { BaseUser as UserInterface } from "@/src/interface/UserInterface";
import useGlobalContext from "@/src/utils/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoEllipsisVertical } from "react-icons/io5";

const HRLeave = () => {
  const [canCreateLeave, setCanCreateLeave] = React.useState(false);
  const [leaves, setLeaves] = React.useState<
    Array<LeaveTypeInterface & UserInterface>
  >([]);
  const { data } = useSession({ required: true });
  const { url } = useGlobalContext();
  const user = data?.user;

  const getLeaves = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken(url);

      if (token && user?.token) {
        const { data: allLeaves } = await axios.get(`${url}/hr/leave`, {
          headers: {
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            Authorization: `Bearer ${user?.token}`,
          },
          withCredentials: true,
        });

        setLeaves(allLeaves.leaves);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token]);

  const handleCanCreateLeave = () => {
    setCanCreateLeave((prev) => !prev);
  };

  const mappedLeaves = leaves.map((leave, index) => {
    return (
      <div
        key={index}
        className="w-full h-fit p-4 rounded-md bg-neutral-100 flex flex-col items-start justify-start gap-4 relative  max-h-56 max-w-full"
      >
        <div className="flex flex-row items-start justify-between w-full">
          <div className="flex flex-col items-start justify-start">
            <p className="font-bold truncate">{leave.type}</p>
            <p className="text-xs">
              Created by: {`${leave.first_name} ${leave.last_name}`}
            </p>
          </div>

          <button className="p-2 rounded-full bg-neutral-100 transition-all">
            <IoEllipsisVertical />
          </button>
        </div>

        <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto">
          <p className="text-sm w-full text-wrap break-words">
            {leave.description}
          </p>
        </div>
      </div>
    );
  });

  React.useEffect(() => {
    getLeaves();
  }, [getLeaves]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateLeave ? (
        <CreateLeave
          toggleModal={handleCanCreateLeave}
          refetchIndex={getLeaves}
        />
      ) : null}
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-screen-l-l p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <button
          onClick={handleCanCreateLeave}
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-40 transition-all"
        >
          Create Leave
          <IoAdd className="text-lg" />
        </button>

        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedLeaves}
        </div>
      </div>
    </div>
  );
};

export default HRLeave;
