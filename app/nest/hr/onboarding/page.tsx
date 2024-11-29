"use client";

import CreateOnboarding from "@/src/components/hr/onboarding/CreateOnboarding";
import React from "react";
import { IoAdd } from "react-icons/io5";

const HROnboarding = () => {
  const [canCreateOnboarding, setCanCreateOnboarding] = React.useState(false);

  const handleCanCreateOnboarding = () => {
    setCanCreateOnboarding((prev) => !prev);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateOnboarding ? (
        <CreateOnboarding toggleModal={handleCanCreateOnboarding} />
      ) : null}
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-screen-l-l p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <button
          onClick={handleCanCreateOnboarding}
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-fit t:px-4 transition-all"
        >
          Create Onboarding <IoAdd className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default HROnboarding;
