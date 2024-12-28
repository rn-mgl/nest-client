"use client";

import CreateTraining from "@/src/components/hr/training/CreateTraining";
import useGlobalContext from "@/src/utils/context";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const HRTraining = () => {
  const [canCreateTraining, setCanCreateTraining] = React.useState(false);
  const { url } = useGlobalContext();
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleCanCreateTraining = () => {
    setCanCreateTraining((prev) => !prev);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateTraining ? (
        <CreateTraining toggleModal={handleCanCreateTraining} />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-screen-l-l p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <button
          onClick={handleCanCreateTraining}
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-fit t:px-4 transition-all"
        >
          Create Training <IoAdd className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default HRTraining;
