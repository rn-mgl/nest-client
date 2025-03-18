"use client";

import Log from "@/src/components/employee/attendance/Log";
import React from "react";
import { IoCalendar } from "react-icons/io5";

const Attendance = () => {
  const [canLog, setCanLog] = React.useState(false);

  const handleCanLog = () => {
    setCanLog((prev) => !prev);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canLog ? <Log toggleModal={handleCanLog} /> : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-screen-l-l p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <button
          onClick={handleCanLog}
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                          gap-2 t:w-fit t:px-4 transition-all"
        >
          Log In <IoCalendar className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default Attendance;
