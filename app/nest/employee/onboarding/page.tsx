"use client";
import ShowOnboarding from "@/src/components/employee/onboarding/ShowOnboarding";
import BaseActions from "@/src/components/global/resource/BaseActions";
import BaseCard from "@/src/components/global/resource/BaseCard";
import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import { useToasts } from "@/src/context/ToastContext";
import useCategory from "@/src/hooks/useCategory";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useIsLoading from "@/src/hooks/useIsLoading";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { UserOnboardingInterface } from "@/src/interface/OnboardingInterface";
import {
  EMPLOYEE_ONBOARDING_CATEGORY,
  EMPLOYEE_ONBOARDING_SEARCH,
  EMPLOYEE_ONBOARDING_SORT,
} from "@/src/utils/filters";
import { isUserSummary } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Onboarding = () => {
  const [employeeOnboardings, setEmployeeOnboardings] = React.useState<
    UserOnboardingInterface[]
  >([]);
  const [activeOnboardingSeeMore, setActiveOnboardingSeeMore] =
    React.useState(0);
  const { isLoading, handleIsLoading } = useIsLoading();

  const { addToast } = useToasts();

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const {
    search,
    canSeeSearchDropDown,
    handleCanSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
  } = useSearch("onboarding.title", "Title");

  const {
    sort,
    canSeeSortDropDown,
    handleToggleAsc,
    handleSelectSort,
    handleCanSeeSortDropDown,
  } = useSort("onboarding.title", "Title");

  const {
    category,
    canSeeCategoryDropDown,
    handleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("status", "All");

  const handleActiveOnboardingSeeMore = (id: number) => {
    setActiveOnboardingSeeMore((prev) => (prev === id ? 0 : id));
  };

  const getEmployeeOnboardings = React.useCallback(
    async (controller: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token) {
          const { data: responseData } = await axios.get(
            `${url}/employee/employee_onboarding`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
              withCredentials: true,
              signal: controller.signal,
            }
          );

          if (responseData.onboardings) {
            setEmployeeOnboardings(responseData.onboardings);
          }
        }
      } catch (error) {
        console.log(error);

        if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the onboardings are being retrieved.";
          addToast("Onboarding Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, addToast, handleIsLoading]
  );

  const mappedOnboardings = useFilterAndSort(
    employeeOnboardings,
    search,
    sort,
    category
  ).map((onboarding, index) => {
    const assignedBy = isUserSummary(onboarding.assigned_by)
      ? onboarding.assigned_by.first_name
      : null;

    return (
      <BaseCard
        key={index}
        title={onboarding.onboarding.title}
        description={onboarding.onboarding.description}
        assignedBy={assignedBy}
      >
        <BaseActions
          handleActiveSeeMore={() =>
            handleActiveOnboardingSeeMore(onboarding.id ?? 0)
          }
        />
      </BaseCard>
    );
  });

  React.useEffect(() => {
    const controller = new AbortController();

    getEmployeeOnboardings(controller);

    return () => {
      controller.abort();
    };
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
          categoryKeyValuePairs={EMPLOYEE_ONBOARDING_CATEGORY}
          category={{
            categoryKey: category.categoryKey,
            categoryValue: category.categoryValue,
            canSeeCategoryDropDown: canSeeCategoryDropDown,
            selectCategory: handleSelectCategory,
            toggleCanSeeCategoryDropDown: handleCanSeeCategoryDropDown,
          }}
          //
          sortKeyLabelPairs={EMPLOYEE_ONBOARDING_SORT}
          sort={{
            sortKey: sort.sortKey,
            sortLabel: sort.sortLabel,
            selectSort: handleSelectSort,
            toggleCanSeeSortDropDown: handleCanSeeSortDropDown,
            isAsc: sort.isAsc,
            toggleAsc: handleToggleAsc,
            canSeeSortDropDown: canSeeSortDropDown,
          }}
          //
          searchKeyLabelPairs={EMPLOYEE_ONBOARDING_SEARCH}
          search={{
            onChange: handleSearch,
            searchKey: search.searchKey,
            searchLabel: search.searchLabel,
            searchValue: search.searchValue,
            selectSearch: handleSelectSearch,
            toggleCanSeeSearchDropDown: handleCanSeeSearchDropDown,
            canSeeSearchDropDown: canSeeSearchDropDown,
          }}
        />

        {isLoading ? (
          <PageSkeletonLoader />
        ) : (
          <div className="grid grid-cols-1 w-full gap-4 t:grid-cols-2 l-l:grid-cols-3">
            {mappedOnboardings}
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
