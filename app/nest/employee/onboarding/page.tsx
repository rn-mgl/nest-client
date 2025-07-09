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

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import useCategory from "@/src/hooks/useCategory";
import Filter from "@/src/components/global/filter/Filter";
import {
  EMPLOYEE_ONBOARDING_CATEGORY,
  EMPLOYEE_ONBOARDING_SEARCH,
  EMPLOYEE_ONBOARDING_SORT,
} from "@/src/utils/filters";

const Onboarding = () => {
  const [employeeOnboardings, setEmployeeOnboardings] = React.useState<
    (EmployeeOnboardingInterface & OnboardingInterface & UserInterface)[]
  >([]);
  const [activeOnboardingSeeMore, setActiveOnboardingSeeMore] =
    React.useState(0);

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const {
    search,
    debounceSearch,
    canSeeSearchDropDown,
    handleCanSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
  } = useSearch("title", "Title");
  const {
    sort,
    canSeeSortDropDown,
    handleToggleAsc,
    handleSelectSort,
    handleCanSeeSortDropDown,
  } = useSort("title", "Title");
  const {
    category,
    canSeeCategoryDropDown,
    handleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("status", "all", "All");

  const handleActiveOnboardingSeeMore = (id: number) => {
    setActiveOnboardingSeeMore((prev) => (prev === id ? 0 : id));
  };

  const getEmployeeOnboardings = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/employee_onboarding`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
            params: { ...search, ...sort, ...category },
          }
        );

        if (responseData.onboardings) {
          setEmployeeOnboardings(responseData.onboardings);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, search, sort, category]);

  const mappedOnboardings = employeeOnboardings.map((onboarding, index) => {
    return (
      <OnboardingCard
        createdBy={false}
        role={user?.role as string}
        key={index}
        onboarding={onboarding}
        handleActiveSeeMore={() =>
          handleActiveOnboardingSeeMore(
            onboarding.employee_onboarding_id ?? 0
          )
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
          toggleModal={() => handleActiveOnboardingSeeMore(0)}
        />
      ) : null}
      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
      t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          //
          useSearchFilter={true}
          useSortFilter={true}
          useCategoryFilter={true}
          //
          categoryKeyValuePairs={EMPLOYEE_ONBOARDING_CATEGORY}
          categoryLabel={category.categoryLabel}
          canSeeCategoryDropDown={canSeeCategoryDropDown}
          selectCategory={handleSelectCategory}
          toggleCanSeeCategoryDropDown={handleCanSeeCategoryDropDown}
          //
          sortKeyLabelPairs={EMPLOYEE_ONBOARDING_SORT}
          sortKey={sort.sortKey}
          sortLabel={sort.sortLabel}
          selectSort={handleSelectSort}
          toggleCanSeeSortDropDown={handleCanSeeSortDropDown}
          isAsc={sort.isAsc}
          toggleAsc={handleToggleAsc}
          canSeeSortDropDown={canSeeSortDropDown}
          //
          onChange={handleSearch}
          searchKey={debounceSearch.searchKey}
          searchLabel={debounceSearch.searchLabel}
          searchValue={debounceSearch.searchValue}
          searchKeyLabelPairs={EMPLOYEE_ONBOARDING_SEARCH}
          selectSearch={handleSelectSearch}
          toggleCanSeeSearchDropDown={handleCanSeeSearchDropDown}
          canSeeSearchDropDown={canSeeSearchDropDown}
        />
        <div className="grid grid-cols-1 w-full gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedOnboardings}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
