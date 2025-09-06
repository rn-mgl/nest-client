"use client";

import Filter from "@/src/components/global/filter/Filter";
import OnboardingCard from "@/src/components/global/onboarding/OnboardingCard";
import AssignOnboarding from "@/src/components/hr/onboarding/AssignOnboarding";
import CreateOnboarding from "@/src/components/hr/onboarding/CreateOnboarding";
import EditOnboarding from "@/src/components/hr/onboarding/EditOnboarding";
import ShowOnboarding from "@/src/components/hr/onboarding/ShowOnboarding";

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { OnboardingInterface } from "@/src/interface/OnboardingInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { HR_ONBOARDING_SEARCH, HR_ONBOARDING_SORT } from "@/src/utils/filters";
import axios from "axios";

import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import useIsLoading from "@/src/hooks/useIsLoading";
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

  const {
    search,
    canSeeSearchDropDown,
    debounceSearch,
    handleSearch,
    handleCanSeeSearchDropDown,
    handleSelectSearch,
  } = useSearch("title", "Title");
  const {
    sort,
    canSeeSortDropDown,
    handleCanSeeSortDropDown,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("title", "Title");

  const { isLoading, handleIsLoading } = useIsLoading(true);

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
    handleIsLoading(true);
    try {
      if (user?.token) {
        const { data: allOnboarding } = await axios.get(
          `${url}/hr/onboarding`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
            params: { ...search, ...sort },
          }
        );

        setOnboardings(allOnboarding.onboardings);

        handleIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      handleIsLoading(false);
    }
  }, [url, user?.token, search, sort, handleIsLoading]);

  const mappedOnboardings = onboardings?.map((onboarding, index) => {
    const onboardingId = onboarding.onboarding_id ?? 0;
    const activeMenu = activeOnboardingMenu === onboardingId;
    const createdBy = user?.current === onboarding.created_by;

    return (
      <OnboardingCard
        key={index}
        role={user?.role ?? ""}
        activeMenu={activeMenu}
        createdBy={createdBy}
        // onboarding
        title={onboarding.title}
        description={onboarding.description}
        // user
        email={onboarding.email}
        first_name={onboarding.first_name}
        last_name={onboarding.last_name}
        id={onboarding.id}
        // actions
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
        <DeleteEntity
          route="onboarding"
          label="Onboarding"
          id={activeOnboardingMenu}
          toggleModal={handleCanDeleteOnboarding}
          refetchIndex={getOnboardings}
        />
      ) : null}

      {activeOnboardingSeeMore ? (
        <ShowOnboarding
          id={activeOnboardingSeeMore}
          toggleModal={() => handleActiveOnboardingSeeMore(0)}
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
          useSearchFilter={true}
          useSortFilter={true}
          useCategoryFilter={false}
          searchKey={debounceSearch.searchKey}
          searchLabel={debounceSearch.searchLabel}
          searchValue={debounceSearch.searchValue}
          searchKeyLabelPairs={HR_ONBOARDING_SEARCH}
          canSeeSearchDropDown={canSeeSearchDropDown}
          selectSearch={handleSelectSearch}
          toggleCanSeeSearchDropDown={handleCanSeeSearchDropDown}
          onChange={handleSearch}
          sortKey={sort.sortKey}
          sortLabel={sort.sortLabel}
          isAsc={sort.isAsc}
          canSeeSortDropDown={canSeeSortDropDown}
          sortKeyLabelPairs={HR_ONBOARDING_SORT}
          toggleAsc={handleToggleAsc}
          selectSort={handleSelectSort}
          toggleCanSeeSortDropDown={handleCanSeeSortDropDown}
        />
        <button
          onClick={handleCanCreateOnboarding}
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-fit t:px-4 transition-all"
        >
          Create Onboarding <IoAdd className="text-lg" />
        </button>

        {isLoading ? (
          <PageSkeletonLoader />
        ) : (
          <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
            {mappedOnboardings}
          </div>
        )}
      </div>
    </div>
  );
};

export default HROnboarding;
