"use client";

import Filter from "@/src/components/global/filter/Filter";
import AssignOnboarding from "@/src/components/onboarding/AssignOnboarding";
import CreateOnboarding from "@/src/components/onboarding/CreateOnboarding";
import EditOnboarding from "@/src/components/onboarding/EditOnboarding";
import ShowOnboarding from "@/src/components/onboarding/ShowOnboarding";

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { OnboardingInterface } from "@/src/interface/OnboardingInterface";
import {
  HR_ONBOARDING_SEARCH,
  HR_ONBOARDING_SORT,
} from "@/src/configs/filters";
import axios, { isAxiosError } from "axios";

import BaseActions from "@/src/components/global/resource/BaseActions";
import BaseCard from "@/src/components/global/resource/BaseCard";
import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import ResourceActions from "@/src/components/global/resource/ResourceActions";
import { useToasts } from "@/src/context/ToastContext";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useIsLoading from "@/src/hooks/useIsLoading";
import { isUserSummary } from "@/src/utils/utils";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const HROnboarding = () => {
  const [onboardings, setOnboardings] = React.useState<OnboardingInterface[]>(
    []
  );
  const [canCreateOnboarding, setCanCreateOnboarding] = React.useState(false);
  const [activeEditOnboarding, setActiveEditOnboarding] = React.useState(0);
  const [activeDeleteOnboarding, setActiveDeleteOnboarding] = React.useState(0);
  const [activeAssignOnboarding, setActiveAssignOnboarding] = React.useState(0);
  const [activeOnboardingSeeMore, setActiveOnboardingSeeMore] =
    React.useState(0);
  const { isLoading, handleIsLoading } = useIsLoading();

  const { addToast } = useToasts();

  const {
    canSeeSearchDropDown,
    search,
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

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleCanCreateOnboarding = () => {
    setCanCreateOnboarding((prev) => !prev);
  };

  const handleActiveOnboardingSeeMore = (id: number) => {
    setActiveOnboardingSeeMore((prev) => (id === prev ? 0 : id));
  };

  const handleActiveEditOnboarding = (id: number) => {
    setActiveEditOnboarding((prev) => (id === prev ? 0 : id));
  };

  const handleActiveDeleteOnboarding = (id: number) => {
    setActiveDeleteOnboarding((prev) => (id === prev ? 0 : id));
  };

  const handleActiveAssignOnboarding = (id: number) => {
    setActiveAssignOnboarding((prev) => (id === prev ? 0 : id));
  };

  const getOnboardings = React.useCallback(
    async (controller?: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token) {
          const { data: allOnboarding } = await axios.get(
            `${url}/hr/onboarding`,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
              signal: controller?.signal,
              withCredentials: true,
            }
          );

          setOnboardings(allOnboarding.onboardings);
        }
      } catch (error) {
        console.log(error);

        if (isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            `An error occurred when the onboardings are being retrieved.`;
          addToast("Onboarding Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, addToast, handleIsLoading]
  );

  const mappedOnboardings = useFilterAndSort(onboardings, search, sort).map(
    (onboarding) => {
      const onboardingId = onboarding.id ?? 0;
      const createdBy = isUserSummary(onboarding.created_by)
        ? onboarding.created_by.first_name
        : null;

      return (
        <BaseCard
          key={`${onboarding.title}-${onboardingId}`}
          title={onboarding.title}
          description={onboarding.description}
          createdBy={createdBy}
        >
          <BaseActions
            handleActiveSeeMore={() =>
              handleActiveOnboardingSeeMore(onboardingId)
            }
          />
          <ResourceActions
            handleActiveEdit={() => handleActiveEditOnboarding(onboardingId)}
            handleActiveDelete={() =>
              handleActiveDeleteOnboarding(onboardingId)
            }
            handleActiveAssign={() =>
              handleActiveAssignOnboarding(onboardingId)
            }
          />
        </BaseCard>
      );
    }
  );

  React.useEffect(() => {
    const controller = new AbortController();

    getOnboardings(controller);

    return () => {
      controller.abort();
    };
  }, [getOnboardings]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateOnboarding ? (
        <CreateOnboarding
          refetchIndex={getOnboardings}
          toggleModal={handleCanCreateOnboarding}
        />
      ) : null}

      {activeEditOnboarding ? (
        <EditOnboarding
          id={activeEditOnboarding}
          refetchIndex={getOnboardings}
          toggleModal={() => handleActiveEditOnboarding(activeEditOnboarding)}
        />
      ) : null}

      {activeDeleteOnboarding ? (
        <DeleteEntity
          route="onboarding"
          label="Onboarding"
          id={activeDeleteOnboarding}
          toggleModal={() =>
            handleActiveDeleteOnboarding(activeDeleteOnboarding)
          }
          refetchIndex={getOnboardings}
        />
      ) : null}

      {activeOnboardingSeeMore ? (
        <ShowOnboarding
          id={activeOnboardingSeeMore}
          toggleModal={() =>
            handleActiveOnboardingSeeMore(activeOnboardingSeeMore)
          }
        />
      ) : null}

      {activeAssignOnboarding ? (
        <AssignOnboarding
          id={activeAssignOnboarding}
          toggleModal={() =>
            handleActiveAssignOnboarding(activeAssignOnboarding)
          }
        />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          searchKeyLabelPairs={HR_ONBOARDING_SEARCH}
          search={{
            searchKey: search.searchKey,
            searchLabel: search.searchLabel,
            searchValue: search.searchValue,
            canSeeSearchDropDown: canSeeSearchDropDown,
            selectSearch: handleSelectSearch,
            toggleCanSeeSearchDropDown: handleCanSeeSearchDropDown,
            onChange: handleSearch,
          }}
          //
          sortKeyLabelPairs={HR_ONBOARDING_SORT}
          sort={{
            sortKey: sort.sortKey,
            sortLabel: sort.sortLabel,
            isAsc: sort.isAsc,
            canSeeSortDropDown: canSeeSortDropDown,
            toggleAsc: handleToggleAsc,
            selectSort: handleSelectSort,
            toggleCanSeeSortDropDown: handleCanSeeSortDropDown,
          }}
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
