"use client";
import ShowOnboarding from "@/src/components/employee/onboarding/ShowOnboarding";
import BaseActions from "@/src/components/global/resource/BaseActions";
import BaseCard from "@/src/components/global/resource/BaseCard";
import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import PageTabs from "@/src/components/global/navigation/PageTabs";
import ResourceActions from "@/src/components/global/resource/ResourceActions";
import AssignOnboarding from "@/src/components/onboarding/AssignOnboarding";
import CreateOnboarding from "@/src/components/onboarding/CreateOnboarding";
import EditOnboarding from "@/src/components/onboarding/EditOnboarding";
import { useToasts } from "@/src/context/ToastContext";
import useCategory from "@/src/hooks/useCategory";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useIsLoading from "@/src/hooks/useIsLoading";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  OnboardingInterface,
  UserOnboardingInterface,
} from "@/src/interface/OnboardingInterface";
import {
  EMPLOYEE_ONBOARDING_CATEGORY,
  EMPLOYEE_ONBOARDING_SEARCH,
  EMPLOYEE_ONBOARDING_SORT,
} from "@/src/utils/filters";
import {
  isOnboardingSummary,
  isUserOnboardingSummary,
  isUserSummary,
} from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const Onboarding = ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) => {
  const [onboardings, setOnboardings] = React.useState<
    (UserOnboardingInterface | OnboardingInterface)[]
  >([]);
  const [activeTab, setActiveTab] = React.useState<string>("assignments");
  const [canCreateOnboarding, setCanCreateOnboarding] = React.useState(false);
  const [activeEditOnboarding, setActiveEditOnboarding] = React.useState(0);
  const [activeDeleteOnboarding, setActiveDeleteOnboarding] = React.useState(0);
  const [activeAssignOnboarding, setActiveAssignOnboarding] = React.useState(0);
  const [activeOnboardingSeeMore, setActiveOnboardingSeeMore] =
    React.useState(0);
  const { isLoading, handleIsLoading } = useIsLoading();

  const { addToast } = useToasts();

  const { tab } = React.use(searchParams);

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
        const endpoints = {
          assignments: "assigned",
          records: "resource",
        };

        const endpoint: string =
          endpoints[activeTab as keyof object] ?? "assigned";

        if (user?.token) {
          const { data: responseData } = await axios.get(
            `${url}/onboarding/${endpoint}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
              withCredentials: true,
              signal: controller?.signal,
            }
          );

          if (responseData.onboardings) {
            setOnboardings(responseData.onboardings);
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
    [url, user?.token, activeTab, addToast, handleIsLoading]
  );

  const mappedOnboardings = useFilterAndSort(
    onboardings,
    search,
    sort,
    category
  ).map((onboarding, index) => {
    // if the onboarding is an OnboardingInterface, it is from the Resource view
    const isResourceOnboarding = isOnboardingSummary(onboarding);

    // if the onboarding is a UserOnboardingInterface, it is from the Assigned view
    const isAssignedOnboarding = isUserOnboardingSummary(onboarding);

    const onboardingId = onboarding.id ?? 0;

    const title = isResourceOnboarding
      ? onboarding.title
      : isAssignedOnboarding
      ? onboarding.onboarding.title
      : "";

    const description = isResourceOnboarding
      ? onboarding.description
      : isAssignedOnboarding
      ? onboarding.onboarding.description
      : "";

    const assignedBy =
      isAssignedOnboarding && isUserSummary(onboarding.assigned_by)
        ? onboarding.assigned_by.first_name
        : null;

    const createdBy =
      isResourceOnboarding && isUserSummary(onboarding.created_by)
        ? onboarding.created_by.first_name
        : null;

    // permissions to check if a user can manage the record
    const canEdit = user?.permissions.includes("update.onboarding_resource");
    const canAssign = user?.permissions.includes("assign.onboarding_resource");
    const canDelete = user?.permissions.includes("delete.onboarding_resource");

    const canManage = canEdit || canAssign || canDelete;

    const actions = [
      <BaseActions
        key={`base-action-${onboardingId}`}
        handleActiveSeeMore={() =>
          handleActiveOnboardingSeeMore(onboarding.id ?? 0)
        }
      />,
    ];

    // push resource actions if can manage
    if (canManage) {
      actions.push(
        <ResourceActions
          key={`resource-action-${onboardingId}`}
          handleActiveEdit={
            canEdit ? () => handleActiveEditOnboarding(onboardingId) : undefined
          }
          handleActiveDelete={
            canDelete
              ? () => handleActiveDeleteOnboarding(onboardingId)
              : undefined
          }
          handleActiveAssign={
            canAssign
              ? () => handleActiveAssignOnboarding(onboardingId)
              : undefined
          }
        />
      );
    }

    return (
      <BaseCard
        key={index}
        title={title}
        description={description}
        assignedBy={assignedBy}
        createdBy={createdBy}
      >
        {actions}
      </BaseCard>
    );
  });

  React.useEffect(() => {
    const controller = new AbortController();

    getOnboardings(controller);

    return () => {
      controller.abort();
    };
  }, [getOnboardings]);

  React.useEffect(() => {
    setActiveTab(tab ?? "assignments");
  }, [tab]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {activeOnboardingSeeMore ? (
        <ShowOnboarding
          id={activeOnboardingSeeMore}
          toggleModal={() => handleActiveOnboardingSeeMore(0)}
        />
      ) : null}

      {canCreateOnboarding &&
      user?.permissions.includes("create.onboarding_resource") ? (
        <CreateOnboarding
          refetchIndex={getOnboardings}
          toggleModal={handleCanCreateOnboarding}
        />
      ) : null}

      {activeEditOnboarding &&
      user?.permissions.includes("update.onboarding_resource") ? (
        <EditOnboarding
          id={activeEditOnboarding}
          refetchIndex={getOnboardings}
          toggleModal={() => handleActiveEditOnboarding(activeEditOnboarding)}
        />
      ) : null}

      {activeDeleteOnboarding &&
      user?.permissions.includes("delete.onboarding_resource") ? (
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
        {user?.permissions.includes("read.onboarding_resource") ? (
          <PageTabs activeTab={activeTab} tabs={["assignments", "records"]} />
        ) : null}

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

        {user?.permissions.includes("create.onboarding_resource") &&
        activeTab === "records" ? (
          <button
            onClick={handleCanCreateOnboarding}
            className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                          gap-2 t:w-fit t:px-4 transition-all"
          >
            Create Onboarding <IoAdd className="text-lg" />
          </button>
        ) : null}

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
