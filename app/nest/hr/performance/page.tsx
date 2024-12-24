"use client";

import CreatePerformance from "@/src/components/hr/performance/CreatePerformance";
import React from "react";
import { IoAdd } from "react-icons/io5";

const Performance = () => {
  const [canCreatePerformance, setCanCreatePerformance] = React.useState(false);
  // const [performances, setPerformances] = React.useState([]);

  const handleCanCreatePerformance = () => {
    setCanCreatePerformance((prev) => !prev);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreatePerformance ? (
        <CreatePerformance toggleModal={handleCanCreatePerformance} />
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
