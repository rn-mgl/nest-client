"use client";
import DeleteEntity from "@/components/global/entity/DeleteEntity";
import Filter from "@/components/global/filter/Filter";
import PageSkeletonLoader from "@/components/global/loader/PageSkeletonLoader";
import PageTabs from "@/components/global/navigation/PageTabs";
import BaseActions from "@/components/global/resource/BaseActions";
import BaseCard from "@/components/global/resource/BaseCard";
import ResourceActions from "@/components/global/resource/ResourceActions";
import AssignTraining from "@/components/training/AssignTraining";
import CreateTraining from "@/components/training/CreateTraining";
import EditTraining from "@/components/training/EditTraining";
import ShowAssignedTraining from "@/components/training/ShowAssignedTraining";
import ShowResourceTraining from "@/components/training/ShowResourceTraining";
import { TRAINING_ENDPOINT } from "@/configs/endpoint";
import {
  ASSIGNED_TRAINING_CATEGORY,
  ASSIGNED_TRAINING_SEARCH,
  ASSIGNED_TRAINING_SORT,
  RESOURCE_TRAINING_SEARCH,
  RESOURCE_TRAINING_SORT,
} from "@/configs/filters";
import { useToasts } from "@/context/ToastContext";
import useCategory from "@/hooks/useCategory";
import useIsLoading from "@/hooks/useIsLoading";
import useSearch from "@/hooks/useSearch";
import useSort from "@/hooks/useSort";
import {
  TrainingInterface,
  UserTrainingInterface,
} from "@/interface/TrainingInterface";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import { isUserSummary } from "@/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const Training = ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) => {
  const [assignedTrainings, setAssignedTrainings] = React.useState<
    UserTrainingInterface[]
  >([]);
  const [resourceTraining, setResourceTraining] = React.useState<
    TrainingInterface[]
  >([]);
  const [activeEditTraining, setActiveEditTraining] = React.useState(0);
  const [activeDeleteTraining, setActiveDeleteTraining] = React.useState(0);
  const [canCreateTraining, setCanCreateTraining] = React.useState(false);
  const [activeAssignTraining, setActiveAssignTraining] = React.useState(0);
  const [activeTrainingSeeMore, setActiveTrainingSeeMore] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("assigned");
  const { isLoading, handleIsLoading } = useIsLoading();
  const { addToast } = useToasts();

  const {
    canSeeSearchDropDown,
    search,
    toggleCanSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
  } = useSearch("title", "Title");

  const {
    sort,
    canSeeSortDropDown,
    toggleCanSeeSortDropDown,
    handleSelectSort,
    toggleAsc,
  } = useSort("deadline", "Deadline");

  const {
    category,
    canSeeCategoryDropDown,
    toggleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("status", "All");

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const { tab } = React.use(searchParams);

  const canEdit = React.useMemo(() => {
    return user?.permissions.includes("update.training_resource");
  }, [user?.permissions]);

  const canDelete = React.useMemo(() => {
    return user?.permissions.includes("delete.training_resource");
  }, [user?.permissions]);

  const canAssign = React.useMemo(() => {
    return user?.permissions.includes("assign.training_resource");
  }, [user?.permissions]);

  const canManage = React.useMemo(() => {
    return canEdit || canDelete || canAssign;
  }, [canEdit, canDelete, canAssign]);

  const SEARCH_FILTER = {
    assigned: ASSIGNED_TRAINING_SEARCH,
    resource: RESOURCE_TRAINING_SEARCH,
  };

  const SORT_FILTER = {
    assigned: ASSIGNED_TRAINING_SORT,
    resource: RESOURCE_TRAINING_SORT,
  };

  const CATEGORY_FILTER = {
    assigned: ASSIGNED_TRAINING_CATEGORY,
  };

  const handleActiveTrainingSeeMore = (id: number) => {
    setActiveTrainingSeeMore((prev) => (prev === id ? 0 : id));
  };

  const handleCanCreateTraining = () => {
    setCanCreateTraining((prev) => !prev);
  };

  const handleActiveEditTraining = (id: number) => {
    setActiveEditTraining((prev) => (prev === id ? 0 : id));
  };

  const handleActiveDeleteTraining = (id: number) => {
    setActiveDeleteTraining((prev) => (prev === id ? 0 : id));
  };

  const handleActiveAssignTraining = (id: number) => {
    setActiveAssignTraining((prev) => (prev === id ? 0 : id));
  };

  const handleFilters = React.useCallback(
    (tab: string) => {
      switch (tab) {
        case "assigned":
          handleSelectSearch("training.title", "Title");
          handleSelectSort("training.title", "Title");
          handleSelectCategory("status", "All");
          break;
        case "resource":
          handleSelectSearch("title", "Title");
          handleSelectSort("title", "Title");
          break;
      }
    },
    [handleSelectSearch, handleSelectSort, handleSelectCategory]
  );

  const getTrainings = React.useCallback(
    async (controller?: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token) {
          const tabConfig =
            TRAINING_ENDPOINT[activeTab] ?? TRAINING_ENDPOINT.assigned;

          const hasPermission =
            !tabConfig.requiredPermission ||
            user.permissions.includes(tabConfig.requiredPermission);

          const endpoint = hasPermission
            ? tabConfig.url
            : TRAINING_ENDPOINT.assigned.url;

          const { data: responseData } = await axios.get<{
            trainings: UserTrainingInterface[] | TrainingInterface[];
          }>(`${url}/${endpoint}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
            signal: controller?.signal,
          });

          if (responseData.trainings) {
            switch (activeTab) {
              case "assigned":
                setAssignedTrainings(
                  responseData.trainings as UserTrainingInterface[]
                );
                break;
              case "resource":
                setResourceTraining(
                  responseData.trainings as TrainingInterface[]
                );
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
            "An error occurred when the trainings are being retrieved.";
          addToast("Training Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, activeTab, user?.permissions, addToast, handleIsLoading]
  );

  const mappedAssignedTrainings = useFilterAndSort(
    assignedTrainings,
    search,
    sort,
    category
  ).map((training) => {
    const assignedBy = isUserSummary(training.assigned_by)
      ? training.assigned_by.first_name
      : null;

    return (
      <BaseCard
        key={`assigned-${training.id}`}
        title={training.training.title}
        description={training.training.description}
        assignedBy={assignedBy}
      >
        <BaseActions
          handleActiveSeeMore={() =>
            handleActiveTrainingSeeMore(training.id ?? 0)
          }
        />
      </BaseCard>
    );
  });

  const mappedResourceTrainings = useFilterAndSort(
    resourceTraining,
    search,
    sort
  ).map((training) => {
    const createdBy = isUserSummary(training.created_by)
      ? training.created_by.first_name
      : null;

    return (
      <BaseCard
        key={`resource-${training.id}`}
        title={training.title}
        description={training.description}
        createdBy={createdBy}
      >
        <BaseActions
          handleActiveSeeMore={() =>
            handleActiveTrainingSeeMore(training.id ?? 0)
          }
        />
        {canManage ? (
          <ResourceActions
            handleActiveAssign={
              canAssign
                ? () => handleActiveAssignTraining(training.id ?? 0)
                : null
            }
            handleActiveDelete={
              canDelete
                ? () => handleActiveDeleteTraining(training.id ?? 0)
                : null
            }
            handleActiveEdit={
              canEdit ? () => handleActiveEditTraining(training.id ?? 0) : null
            }
          />
        ) : null}
      </BaseCard>
    );
  });

  React.useEffect(() => {
    const controller = new AbortController();

    getTrainings(controller);

    return () => {
      controller.abort();
    };
  }, [getTrainings]);

  React.useEffect(() => {
    if (!tab) {
      setActiveTab("assigned");
      return;
    }

    const newTab = ["assigned", "resource"].includes(tab) ? tab : "assigned";

    setActiveTab(newTab);
  }, [tab]);

  React.useEffect(() => {
    handleFilters(activeTab ?? "assigned");
  }, [activeTab, handleFilters]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateTraining ? (
        <CreateTraining
          toggleModal={handleCanCreateTraining}
          refetchIndex={getTrainings}
        />
      ) : null}

      {activeTrainingSeeMore ? (
        activeTab === "assigned" ? (
          <ShowAssignedTraining
            id={activeTrainingSeeMore}
            toggleModal={() => handleActiveTrainingSeeMore(0)}
          />
        ) : activeTab === "resource" &&
          user?.permissions.includes("read.training_resource") ? (
          <ShowResourceTraining
            id={activeTrainingSeeMore}
            toggleModal={() => handleActiveTrainingSeeMore(0)}
          />
        ) : null
      ) : null}

      {activeEditTraining ? (
        <EditTraining
          id={activeEditTraining}
          toggleModal={() => handleActiveEditTraining(activeEditTraining)}
          refetchIndex={getTrainings}
        />
      ) : null}

      {activeAssignTraining ? (
        <AssignTraining
          id={activeAssignTraining}
          toggleModal={() => handleActiveAssignTraining(activeAssignTraining)}
        />
      ) : null}

      {activeDeleteTraining ? (
        <DeleteEntity
          route="training/resource"
          label="Training"
          id={activeDeleteTraining}
          toggleModal={() => handleActiveDeleteTraining(activeDeleteTraining)}
          refetchIndex={getTrainings}
        />
      ) : null}
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2 
                    t:items-start gap-4 t:p-4 t:gap-8"
      >
        {user?.permissions.includes("read.training_resource") ? (
          <PageTabs activeTab={activeTab} tabs={["assigned", "resource"]} />
        ) : null}

        <Filter
          searchKeyLabelPairs={SEARCH_FILTER[activeTab as keyof object]}
          search={{
            searchKey: search.searchKey,
            searchValue: search.searchValue,
            searchLabel: search.searchLabel,
            canSeeSearchDropDown: canSeeSearchDropDown,
            toggleCanSeeSearchDropDown: toggleCanSeeSearchDropDown,
            onChange: handleSearch,
            selectSearch: handleSelectSearch,
          }}
          //
          categoryKeyValuePairs={CATEGORY_FILTER[activeTab as keyof object]}
          category={{
            categoryKey: category.categoryKey,
            categoryValue: category.categoryValue,
            canSeeCategoryDropDown: canSeeCategoryDropDown,
            toggleCanSeeCategoryDropDown: toggleCanSeeCategoryDropDown,
            selectCategory: handleSelectCategory,
          }}
          //
          sortKeyLabelPairs={SORT_FILTER[activeTab as keyof object]}
          sort={{
            sortKey: sort.sortKey,
            sortLabel: sort.sortLabel,
            isAsc: sort.isAsc,
            canSeeSortDropDown: canSeeSortDropDown,
            toggleCanSeeSortDropDown: toggleCanSeeSortDropDown,
            toggleAsc: toggleAsc,
            selectSort: handleSelectSort,
          }}
        />

        {activeTab === "resource" &&
        user?.permissions.includes("create.training_resource") ? (
          <button
            onClick={handleCanCreateTraining}
            className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                          gap-2 t:w-fit t:px-4 transition-all"
          >
            Create Training <IoAdd className="text-lg" />
          </button>
        ) : null}

        {isLoading ? (
          <PageSkeletonLoader />
        ) : (
          <div className="w-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3 gap-4">
            {activeTab === "assigned"
              ? mappedAssignedTrainings
              : activeTab === "resource" &&
                user?.permissions.includes("read.training_resource")
              ? mappedResourceTrainings
              : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Training;
