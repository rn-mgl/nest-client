"use client";
import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import PageTabs from "@/src/components/global/navigation/PageTabs";
import BaseActions from "@/src/components/global/resource/BaseActions";
import BaseCard from "@/src/components/global/resource/BaseCard";
import ResourceActions from "@/src/components/global/resource/ResourceActions";
import AssignOnboarding from "@/src/components/onboarding/AssignOnboarding";
import CreateOnboarding from "@/src/components/onboarding/CreateOnboarding";
import EditOnboarding from "@/src/components/onboarding/EditOnboarding";
import ShowAssignedOnboarding from "@/src/components/onboarding/ShowAssignedOnboarding";
import ShowResourceOnboarding from "@/src/components/onboarding/ShowResourceOnboarding";
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
import { ONBOARDING_ENDPOINT } from "@/src/configs/endpoint";
import {
  ASSIGNED_ONBOARDING_CATEGORY,
  ASSIGNED_ONBOARDING_SEARCH,
  ASSIGNED_ONBOARDING_SORT,
  RESOURCE_ONBOARDING_SEARCH,
  RESOURCE_ONBOARDING_SORT,
} from "@/src/configs/filters";
import { isUserSummary, normalizeString } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const Onboarding = ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) => {
  const [resourceOnboardings, setResourceOnboardings] = React.useState<
    OnboardingInterface[]
  >([]);
  const [assignedOnboardings, setAssignedOnboardings] = React.useState<
    UserOnboardingInterface[]
  >([]);
  const [activeTab, setActiveTab] = React.useState<string>("assigned");
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

  // permissions to check if a user can manage the record
  const canEdit = React.useMemo(() => {
    return user?.permissions.includes("update.onboarding_resource");
  }, [user?.permissions]);

  const canAssign = React.useMemo(() => {
    return user?.permissions.includes("assign.onboarding_resource");
  }, [user?.permissions]);

  const canDelete = React.useMemo(() => {
    return user?.permissions.includes("delete.onboarding_resource");
  }, [user?.permissions]);

  const canManage = React.useMemo(() => {
    return canEdit || canAssign || canDelete;
  }, [canEdit, canAssign, canDelete]);

  // render filters based on tab
  const SEARCH_FILTERS = React.useMemo(() => {
    return {
      assigned: ASSIGNED_ONBOARDING_SEARCH,
      resource: RESOURCE_ONBOARDING_SEARCH,
    };
  }, []);

  const SORT_FILTERS = React.useMemo(() => {
    return {
      assigned: ASSIGNED_ONBOARDING_SORT,
      resource: RESOURCE_ONBOARDING_SORT,
    };
  }, []);

  const CATEGORY_FILTERS = React.useMemo(() => {
    return {
      assigned: ASSIGNED_ONBOARDING_CATEGORY,
    };
  }, []);

  const {
    search,
    canSeeSearchDropDown,
    toggleCanSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
  } = useSearch("onboarding.title", "Title");

  const {
    sort,
    canSeeSortDropDown,
    toggleAsc,
    handleSelectSort,
    toggleCanSeeSortDropDown,
  } = useSort("onboarding.title", "Title");

  const {
    category,
    canSeeCategoryDropDown,
    toggleCanSeeCategoryDropDown,
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

  const handleFilters = React.useCallback(
    (tab: string) => {
      switch (tab) {
        case "assigned":
          handleSelectSearch("onboarding.title", "Title");
          handleSelectSort("onboarding.title", "Assigned At");
          handleSelectCategory("status", "All");
          break;
        case "resource":
          handleSelectSearch("title", "Title");
          handleSelectSort("title", "Title");
          break;
        default:
          break;
      }
    },
    [handleSelectSearch, handleSelectSort, handleSelectCategory]
  );

  const getOnboardings = React.useCallback(
    async (controller?: AbortController) => {
      handleIsLoading(true);

      try {
        const tabEndpoint =
          ONBOARDING_ENDPOINT[activeTab as keyof object] ??
          ONBOARDING_ENDPOINT.assigned;

        const hasPermission =
          !tabEndpoint.requiredPermission ||
          user?.permissions.includes(tabEndpoint.requiredPermission);

        const endpoint = hasPermission
          ? tabEndpoint.url
          : ONBOARDING_ENDPOINT.assigned.url;

        if (user?.token) {
          const { data: responseData } = await axios.get(`${url}/${endpoint}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
            signal: controller?.signal,
          });

          if (responseData.onboardings) {
            switch (activeTab) {
              case "assigned":
                setAssignedOnboardings(responseData.onboardings);
                break;
              case "resource":
                setResourceOnboardings(responseData.onboardings);
              default:
                break;
            }
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
    [url, user?.token, user?.permissions, activeTab, addToast, handleIsLoading]
  );

  const mappedAssignedOnboardings = useFilterAndSort(
    assignedOnboardings,
    search,
    sort,
    category
  ).map((onboarding, index) => {
    // if the onboarding is an OnboardingInterface, it is from the Resource view

    const assignedBy = isUserSummary(onboarding.assigned_by)
      ? onboarding.assigned_by.first_name
      : null;

    return (
      <BaseCard
        key={onboarding.id}
        title={onboarding.onboarding.title}
        description={onboarding.onboarding.description}
        status={normalizeString(
          typeof onboarding.status === "string" ? onboarding.status : ""
        )}
        assignedBy={assignedBy}
      >
        <BaseActions
          key={`base-action-${onboarding.onboarding.id}`}
          handleActiveSeeMore={
            () => handleActiveOnboardingSeeMore(onboarding.id ?? 0) // user_onboarding id
          }
        />
      </BaseCard>
    );
  });

  const mappedResourceOnboardings = useFilterAndSort(
    resourceOnboardings,
    search,
    sort,
    category
  ).map((onboarding) => {
    // if the onboarding is an OnboardingInterface, it is from the Resource view
    const createdBy = isUserSummary(onboarding.created_by)
      ? onboarding.created_by.first_name
      : null;

    return (
      <BaseCard
        key={onboarding.id}
        title={onboarding.title}
        description={onboarding.description}
        assignedBy={createdBy}
      >
        <BaseActions
          key={`base-action-${onboarding.id}`}
          handleActiveSeeMore={
            () => handleActiveOnboardingSeeMore(onboarding.id ?? 0) // onboarding id
          }
        />
        {canManage ? (
          <ResourceActions
            key={`resource-action-${onboarding.id}`}
            handleActiveEdit={
              canEdit
                ? () => handleActiveEditOnboarding(onboarding.id ?? 0)
                : null
            }
            handleActiveDelete={
              canDelete
                ? () => handleActiveDeleteOnboarding(onboarding.id ?? 0)
                : null
            }
            handleActiveAssign={
              canAssign
                ? () => handleActiveAssignOnboarding(onboarding.id ?? 0)
                : null
            }
          />
        ) : null}
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
    handleFilters(activeTab ?? "assigned");
  }, [activeTab, handleFilters]);

  React.useEffect(() => {
    if (!tab) {
      setActiveTab("assigned");
      return;
    }

    const newTab = ["assigned", "resource"].includes(tab) ? tab : "assigned";

    setActiveTab(newTab);
  }, [tab]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {/* separately render assigned onboarding and resource onboarding based on tab, 
      with permission checking on resource view*/}
      {activeOnboardingSeeMore ? (
        activeTab === "assigned" ? (
          <ShowAssignedOnboarding
            id={activeOnboardingSeeMore}
            viewSource="assignee"
            toggleModal={() =>
              handleActiveOnboardingSeeMore(activeOnboardingSeeMore)
            }
          />
        ) : activeTab === "resource" &&
          user?.permissions.includes("read.onboarding_resource") ? (
          <ShowResourceOnboarding
            id={activeOnboardingSeeMore}
            toggleModal={() =>
              handleActiveOnboardingSeeMore(activeOnboardingSeeMore)
            }
          />
        ) : null
      ) : null}

      {/* show create modal if has permission */}
      {canCreateOnboarding &&
      user?.permissions.includes("create.onboarding_resource") ? (
        <CreateOnboarding
          refetchIndex={() => getOnboardings()}
          toggleModal={handleCanCreateOnboarding}
        />
      ) : null}

      {/* show edit modal if has permission */}
      {activeEditOnboarding &&
      user?.permissions.includes("update.onboarding_resource") ? (
        <EditOnboarding
          id={activeEditOnboarding}
          refetchIndex={() => getOnboardings()}
          toggleModal={() => handleActiveEditOnboarding(activeEditOnboarding)}
        />
      ) : null}

      {/* show delete modal if has permission */}
      {activeDeleteOnboarding &&
      user?.permissions.includes("delete.onboarding_resource") ? (
        <DeleteEntity
          route="onboarding/resource"
          label="Onboarding"
          id={activeDeleteOnboarding}
          toggleModal={() =>
            handleActiveDeleteOnboarding(activeDeleteOnboarding)
          }
          refetchIndex={() => getOnboardings()}
        />
      ) : null}

      {/* show assign modal if has permission */}
      {activeAssignOnboarding &&
      user?.permissions.includes("assign.onboarding_resource") ? (
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
        {/* display tabs if the user can see onboarding resource */}
        {user?.permissions.includes("read.onboarding_resource") ? (
          <PageTabs activeTab={activeTab} tabs={["assigned", "resource"]} />
        ) : null}

        <Filter
          categoryKeyValuePairs={CATEGORY_FILTERS[activeTab as keyof object]}
          category={{
            categoryKey: category.categoryKey,
            categoryValue: category.categoryValue,
            canSeeCategoryDropDown: canSeeCategoryDropDown,
            selectCategory: handleSelectCategory,
            toggleCanSeeCategoryDropDown: toggleCanSeeCategoryDropDown,
          }}
          //
          sortKeyLabelPairs={SORT_FILTERS[activeTab as keyof object]}
          sort={{
            sortKey: sort.sortKey,
            sortLabel: sort.sortLabel,
            selectSort: handleSelectSort,
            toggleCanSeeSortDropDown: toggleCanSeeSortDropDown,
            isAsc: sort.isAsc,
            toggleAsc: toggleAsc,
            canSeeSortDropDown: canSeeSortDropDown,
          }}
          //
          searchKeyLabelPairs={SEARCH_FILTERS[activeTab as keyof object]}
          search={{
            onChange: handleSearch,
            searchKey: search.searchKey,
            searchLabel: search.searchLabel,
            searchValue: search.searchValue,
            selectSearch: handleSelectSearch,
            toggleCanSeeSearchDropDown: toggleCanSeeSearchDropDown,
            canSeeSearchDropDown: canSeeSearchDropDown,
          }}
        />

        {/* display create button on resource page and if user can create resource */}
        {user?.permissions.includes("create.onboarding_resource") &&
        activeTab === "resource" ? (
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
            {activeTab === "assigned"
              ? mappedAssignedOnboardings
              : activeTab === "resource"
              ? mappedResourceOnboardings
              : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
