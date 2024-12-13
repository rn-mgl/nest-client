"use client";

import CreateOnboarding from "@/src/components/hr/onboarding/CreateOnboarding";
import EditOnboarding from "@/src/components/hr/onboarding/EditOnboarding";
import ShowOnboarding from "@/src/components/hr/onboarding/ShowOnboarding";
import { Onboarding as OnboardingInterface } from "@/src/interface/OnboardingInterface";
import { BaseUser as UserInterface } from "@/src/interface/UserInterface";
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

const HROnboarding = () => {
  const [onboardings, setOnboardings] =
    React.useState<Array<OnboardingInterface & UserInterface>>();
  const [canCreateOnboarding, setCanCreateOnboarding] = React.useState(false);
  const [canEditOnboarding, setCanEditOnboarding] = React.useState(false);
  const [activeOnboardingMenu, setActiveOnboardingMenu] = React.useState(0);
  const [activeSeeMore, setActiveSeeMore] = React.useState(0);

  const { url } = useGlobalContext();
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleCanCreateOnboarding = () => {
    setCanCreateOnboarding((prev) => !prev);
  };

  const handleActiveOnboardingMenu = (id: number) => {
    setActiveOnboardingMenu((prev) => (id === prev ? 0 : id));
  };

  const handleActiveSeeMore = (id: number) => {
    setActiveSeeMore((prev) => (id === prev ? 0 : id));
  };

  const handleCanEditonboarding = () => {
    setCanEditOnboarding((prev) => !prev);
  };

  const getOnboardings = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken(url);

      if (token && user?.token) {
        const { data: allOnboarding } = await axios.get(
          `${url}/hr/onboarding`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
            withCredentials: true,
          }
        );

        setOnboardings(allOnboarding.onboardings);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token]);

  const mappedOnboardings = onboardings?.map((onboarding, index) => {
    const activeMenu = activeOnboardingMenu === onboarding.onboarding_id;
    const createdBy = user?.current === onboarding.created_by;

    return (
      <div
        key={index}
        className="w-full min-h-[17rem] p-4 rounded-md bg-neutral-100 flex 
                  flex-col items-center justify-start gap-4 relative max-w-full transition-all"
      >
        <div className="flex flex-row items-start justify-between w-full">
          <div className="flex flex-col items-start justify-start">
            <p className="font-bold truncate">{onboarding.title}</p>
          </div>

          <button
            onClick={() =>
              onboarding.onboarding_id &&
              handleActiveOnboardingMenu(onboarding.onboarding_id)
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
            {onboarding.description}
          </p>
        </div>

        <button
          onClick={() =>
            onboarding.onboarding_id &&
            handleActiveSeeMore(onboarding.onboarding_id)
          }
          className="text-xs hover:underline transition-all underline-offset-2 flex flex-row items-center justify-start gap-1"
        >
          See More <IoArrowForward />
        </button>

        {activeMenu ? (
          <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
            <button
              onClick={handleCanEditonboarding}
              className="w-full p-1 rounded-sm text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoPencil className="text-accent-blue" />
              Edit
            </button>

            {createdBy ? (
              <button
                // onClick={handleCanDeleteonboarding}
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
    getOnboardings();
  }, [getOnboardings]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateOnboarding ? (
        <CreateOnboarding
          refetchIndex={getOnboardings}
          toggleModal={handleCanCreateOnboarding}
        />
      ) : null}

      {canEditOnboarding ? (
        <EditOnboarding
          id={activeOnboardingMenu}
          toggleModal={handleCanEditonboarding}
        />
      ) : null}

      {activeSeeMore ? (
        <ShowOnboarding
          id={activeSeeMore}
          setActiveModal={handleActiveSeeMore}
        />
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

        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedOnboardings}
        </div>
      </div>
    </div>
  );
};

export default HROnboarding;
