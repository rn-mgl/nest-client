"use client";

import CreateLeave from "@/src/components/hr/leave/CreateLeave";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const HRLeave = () => {
  const [canCreateLeave, setCanCreateLeave] = React.useState(false);
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleCanCreateLeave = () => {
    setCanCreateLeave((prev) => !prev);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateLeave ? (
        <CreateLeave toggleModal={handleCanCreateLeave} />
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
      </div>
    </div>
  );
};

export default HRLeave;
