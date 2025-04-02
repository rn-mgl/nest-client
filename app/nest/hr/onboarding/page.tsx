"use client";

import Filter from "@/src/components/global/filter/Filter";
import AssignOnboarding from "@/src/components/hr/onboarding/AssignOnboarding";
import CreateOnboarding from "@/src/components/hr/onboarding/CreateOnboarding";
import DeleteOnboarding from "@/src/components/hr/onboarding/DeleteOnboarding";
import EditOnboarding from "@/src/components/hr/onboarding/EditOnboarding";
import OnboardingCard from "@/src/components/global/onboarding/OnboardingCard";
import ShowOnboarding from "@/src/components/hr/onboarding/ShowOnboarding";
import useCategory from "@/src/hooks/useCategory";
import useFilters from "@/src/hooks/useFilters";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { OnboardingInterface } from "@/src/interface/OnboardingInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  HR_ONBOARDING_CATEGORY,
  HR_ONBOARDING_SEARCH,
  HR_ONBOARDING_SORT,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const HROnboarding = () => {
  const [onboardings, setOnboardings] = React.useState<
    Array<OnboardingInterface & UserInterface>
  >([]);
  const [canCreateOnboarding, setCanCreateOnboarding] = React.useState(false);
  const [canEditOnboarding, setCanEditOnboarding] = React.useState(false);
  const [canDeleteOnboarding, setCanDeleteOnboarding] = React.useState(false);
  const [canAssignOnboarding, setCanAssignOnboarding] = React.useState(false);
  const [activeOnboardingMenu, setActiveOnboardingMenu] = React.useState(0);
  const [activeOnboardingSeeMore, setActiveOnboardingSeeMore] =
    React.useState(0);

  const { showFilters, handleShowFilters } = useFilters();
  const {
    search,
    canShowSearch,
    debounceSearch,
    handleSearch,
    handleCanShowSearch,
    handleSelectSearch,
  } = useSearch("title", "Title");
  const {
    sort,
    canShowSort,
    handleCanShowSort,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("title", "Title");
  const {
    category,
    canShowCategories,
    handleCanShowCategories,
    handleSelectCategory,
  } = useCategory("", "", "");

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleCanCreateOnboarding = () => {
    setCanCreateOnboarding((prev) => !prev);
  };

  const handleActiveOnboardingMenu = (id: number) => {
    setActiveOnboardingMenu((prev) => (id === prev ? 0 : id));
  };

  const handleActiveOnboardingSeeMore = (id: number) => {
    setActiveOnboardingSeeMore((prev) => (id === prev ? 0 : id));
  };

  const handleCanEditOnboarding = () => {
    setCanEditOnboarding((prev) => !prev);
  };

  const handleCanDeleteOnboarding = () => {
    setCanDeleteOnboarding((prev) => !prev);
  };

  const handleCanAssignOnboarding = () => {
    setCanAssignOnboarding((prev) => !prev);
  };

  const getOnboardings = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: allOnboarding } = await axios.get(
          `${url}/hr/onboarding`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
            params: { ...search, ...sort },
          }
        );

        setOnboardings(allOnboarding.onboardings);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, search, sort]);

  const mappedOnboardings = onboardings?.map((onboarding, index) => {
    const onboardingId = onboarding.onboarding_id as number;
    const activeMenu = activeOnboardingMenu === onboardingId;
    const createdBy = user?.current === onboarding.created_by;

    return (
      <OnboardingCard
        role={user?.role as string}
        key={index}
        onboarding={onboarding}
        activeMenu={activeMenu}
        createdBy={createdBy}
        handleActiveMenu={() => handleActiveOnboardingMenu(onboardingId)}
        handleActiveSeeMore={() => handleActiveOnboardingSeeMore(onboardingId)}
        handleCanAssign={handleCanAssignOnboarding}
        handleCanDelete={handleCanDeleteOnboarding}
        handleCanEdit={handleCanEditOnboarding}
      />
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
          refetchIndex={getOnboardings}
          toggleModal={handleCanEditOnboarding}
        />
      ) : null}

      {canDeleteOnboarding ? (
        <DeleteOnboarding
          id={activeOnboardingMenu}
          refetchIndex={getOnboardings}
          toggleModal={handleCanDeleteOnboarding}
        />
      ) : null}

      {activeOnboardingSeeMore ? (
        <ShowOnboarding
          id={activeOnboardingSeeMore}
          setActiveModal={handleActiveOnboardingSeeMore}
        />
      ) : null}

      {canAssignOnboarding ? (
        <AssignOnboarding
          id={activeOnboardingMenu}
          toggleModal={handleCanAssignOnboarding}
        />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          showSearch={true}
          showSort={true}
          showCategory={false}
          searchKey={debounceSearch.searchKey}
          searchLabel={debounceSearch.searchLabel}
          searchValue={debounceSearch.searchValue}
          searchKeyLabelPairs={HR_ONBOARDING_SEARCH}
          canShowSearch={canShowSearch}
          selectSearch={handleSelectSearch}
          toggleShowSearch={handleCanShowSearch}
          onChange={handleSearch}
          showFilters={showFilters}
          toggleShowFilters={handleShowFilters}
          sortKey={sort.sortKey}
          sortLabel={sort.sortLabel}
          isAsc={sort.isAsc}
          canShowSort={canShowSort}
          sortKeyLabelPairs={HR_ONBOARDING_SORT}
          toggleAsc={handleToggleAsc}
          selectSort={handleSelectSort}
          toggleShowSort={handleCanShowSort}
          //
          categoryLabel={category.categoryLabel}
          canShowCategories={canShowCategories}
          categoryKeyValuePairs={HR_ONBOARDING_CATEGORY}
          toggleShowCategories={handleCanShowCategories}
          selectCategory={handleSelectCategory}
        />
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
