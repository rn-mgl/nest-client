"use client";
import OnboardingCard from "@/src/components/hr/onboarding/OnboardingCard";
import { EmployeeOnboardingInterface } from "@/src/interface/OnboardingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Onboarding = () => {
  const [employeeOnboardings, setEmployeeOnboardings] = React.useState<
    EmployeeOnboardingInterface[]
  >([]);

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

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

  console.log(employeeOnboardings);

  const mappedOnboardings = employeeOnboardings.map((onboarding, index) => {
    return (
      <OnboardingCard
        createdBy={false}
        role={user?.role as string}
        key={index}
        onboarding={onboarding.onboarding}
      />
    );
  });

  React.useEffect(() => {
    getEmployeeOnboardings();
  }, [getEmployeeOnboardings]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
      t:items-start t:p-4 gap-4 t:gap-8"
      >
        {mappedOnboardings}
      </div>
    </div>
  );
};

export default Onboarding;
