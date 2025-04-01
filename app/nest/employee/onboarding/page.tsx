"use client";
import OnboardingCard from "@/src/components/global/onboarding/OnboardingCard";
import ShowOnboarding from "@/src/components/employee/onboarding/ShowOnboarding";
import {
  EmployeeOnboardingInterface,
  OnboardingInterface,
} from "@/src/interface/OnboardingInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Onboarding = () => {
  const [employeeOnboardings, setEmployeeOnboardings] = React.useState<
    (EmployeeOnboardingInterface & OnboardingInterface & UserInterface)[]
  >([]);
  const [activeOnboardingSeeMore, setActiveOnboardingSeeMore] =
    React.useState(0);

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const handleActiveOnboardingSeeMore = (id: number) => {
    setActiveOnboardingSeeMore((prev) => (prev === id ? 0 : id));
  };

  const getEmployeeOnboardings = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/onboarding`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.onboardings) {
          setEmployeeOnboardings(responseData.onboardings);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token]);

  const mappedOnboardings = employeeOnboardings.map((onboarding, index) => {
    return (
      <OnboardingCard
        createdBy={false}
        role={user?.role as string}
        key={index}
        onboarding={onboarding}
        handleActiveSeeMore={() =>
          handleActiveOnboardingSeeMore(onboarding.onboarding_id as number)
        }
      />
    );
  });

  React.useEffect(() => {
    getEmployeeOnboardings();
  }, [getEmployeeOnboardings]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {activeOnboardingSeeMore ? (
        <ShowOnboarding
          id={activeOnboardingSeeMore}
          setActiveModal={handleActiveOnboardingSeeMore}
        />
      ) : null}
      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
      t:items-start t:p-4 gap-4 t:gap-8"
      >
        <div className="grid grid-cols-1 w-full gap-4 t:gridoc2 l-l:grid-cols-3">
          {mappedOnboardings}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
