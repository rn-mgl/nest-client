"use client";
import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import PageTabs from "@/src/components/global/navigation/PageTabs";
import BaseActions from "@/src/components/global/resource/BaseActions";
import BaseCard from "@/src/components/global/resource/BaseCard";
import ResourceActions from "@/src/components/global/resource/ResourceActions";
import AssignPerformanceReview from "@/src/components/performance/AssignPerformanceReview";
import CreatePerformanceReview from "@/src/components/performance/CreatePerformanceReview";
import EditPerformanceReview from "@/src/components/performance/EditPerformanceReview";
import ShowAssignedPerformanceReview from "@/src/components/performance/ShowAssignedPerformanceReview";
import ShowResourcePerformanceReview from "@/src/components/performance/ShowResourcePerformanceReview";
import { PERFORMANCE_REVIEW_ENDPOINT } from "@/src/configs/endpoint";
import {
  ASSIGNED_PERFORMANCE_REVIEW_SEARCH,
  ASSIGNED_PERFORMANCE_REVIEW_SORT,
  RESOURCE_PERFORMANCE_REVIEW_SEARCH,
  RESOURCE_PERFORMANCE_REVIEW_SORT,
} from "@/src/configs/filters";
import { useToasts } from "@/src/context/ToastContext";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useIsLoading from "@/src/hooks/useIsLoading";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  PerformanceReviewInterface,
  UserPerformanceReviewInterface,
} from "@/src/interface/PerformanceReviewInterface";
import { isUserSummary } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const Performance = ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) => {
  const [assignedPerformanceReviews, setAssignedPerformanceReviews] =
    React.useState<UserPerformanceReviewInterface[]>([]);
  const [resourcePerformanceReviews, setResourcePerformanceReviews] =
    React.useState<PerformanceReviewInterface[]>([]);
  const [activeTab, setActiveTab] = React.useState("assigned");
  const [activePerformanceReviewSeeMore, setActivePerformanceReviewSeeMore] =
    React.useState(0);
  const [canCreatePerformanceReview, setCanCreatePerformanceReview] =
    React.useState(false);
  React.useState(0);
  const [activeEditPerformanceReview, setActiveEditPerformanceReview] =
    React.useState(0);
  const [activeDeletePerformanceReview, setActiveDeletePerformanceReview] =
    React.useState(0);
  const [activeAssignPerformanceReview, setActiveAssignPerformanceReview] =
    React.useState(0);

  const { isLoading, handleIsLoading } = useIsLoading();
  const { addToast } = useToasts();

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const { tab } = React.use(searchParams);

  const canCreate = React.useMemo(() => {
    return user?.permissions.includes("create.performance_review_resource");
  }, [user?.permissions]);

  const canEdit = React.useMemo(() => {
    return user?.permissions.includes("update.performance_review_resource");
  }, [user?.permissions]);

  const canDelete = React.useMemo(() => {
    return user?.permissions.includes("delete.performance_review_resource");
  }, [user?.permissions]);

  const canAssign = React.useMemo(() => {
    return user?.permissions.includes("assign.performance_review_resource");
  }, [user?.permissions]);

  const canManage = React.useMemo(() => {
    return canCreate || canEdit || canDelete;
  }, [canCreate, canEdit, canDelete]);

  const SEARCH_FILTER = {
    assigned: ASSIGNED_PERFORMANCE_REVIEW_SEARCH,
    resource: RESOURCE_PERFORMANCE_REVIEW_SEARCH,
  };

  const SORT_FILTER = {
    assigned: ASSIGNED_PERFORMANCE_REVIEW_SORT,
    resource: RESOURCE_PERFORMANCE_REVIEW_SORT,
  };

  const {
    search,
    canSeeSearchDropDown,
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
  } = useSort("title", "Title");

  const handleCanCreatePerformanceReview = () => {
    setCanCreatePerformanceReview((prev) => !prev);
  };

  const handleActivePerformanceReviewSeeMore = (id: number) => {
    setActivePerformanceReviewSeeMore((prev) => (prev === id ? 0 : id));
  };

  const handleActiveEditPerformanceReview = (id: number) => {
    setActiveEditPerformanceReview((prev) => (prev === id ? 0 : id));
  };

  const handleActiveDeletePerformanceReview = (id: number) => {
    setActiveDeletePerformanceReview((prev) => (prev === id ? 0 : id));
  };

  const handleActiveAssignPerformanceReview = (id: number) => {
    setActiveAssignPerformanceReview((prev) => (prev === id ? 0 : id));
  };

  const handleFilters = React.useCallback(
    (tab: string) => {
      switch (tab) {
        case "assigned":
          handleSelectSearch("performance_review.title", "Title");
          handleSelectSort("performance_review.title", "Title");
          break;

        case "resource":
          handleSelectSearch("title", "Title");
          handleSelectSort("title", "Title");
          break;
      }
    },
    [handleSelectSearch, handleSelectSort]
  );

  const getPerformanceReviews = React.useCallback(
    async (controller?: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token) {
          const tabConfig =
            PERFORMANCE_REVIEW_ENDPOINT[activeTab] ??
            PERFORMANCE_REVIEW_ENDPOINT.assigned;

          const hasPermission =
            !tabConfig.requiredPermission ||
            user.permissions.includes(tabConfig.requiredPermission);

          const endpoint = hasPermission
            ? tabConfig.url
            : PERFORMANCE_REVIEW_ENDPOINT.assigned.url;

          const { data: responseData } = await axios.get(`${url}/${endpoint}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
            signal: controller?.signal,
          });

          if (responseData.performance_reviews) {
            switch (activeTab) {
              case "assigned":
                setAssignedPerformanceReviews(responseData.performance_reviews);
                break;
              case "resource":
                setResourcePerformanceReviews(responseData.performance_reviews);
                break;
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
            "An error occurred when the performance reviews are being retrieved.";
          addToast("Performance Review Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, activeTab, user?.permissions, addToast, handleIsLoading]
  );

  const mappedAssignedPerformanceReviews = useFilterAndSort(
    assignedPerformanceReviews,
    search,
    sort
  ).map((performance) => {
    const assignedBy = isUserSummary(performance.assigned_by)
      ? performance.assigned_by.first_name
      : null;

    return (
      <BaseCard
        key={`assigned-${performance.id}`}
        title={performance.performance_review.title}
        description={performance.performance_review.description}
        assignedBy={assignedBy}
      >
        <BaseActions
          handleActiveSeeMore={() =>
            handleActivePerformanceReviewSeeMore(performance.id ?? 0)
          }
        />
      </BaseCard>
    );
  });

  const mappedResourcePerformanceReviews = useFilterAndSort(
    resourcePerformanceReviews,
    search,
    sort
  ).map((performance) => {
    const createdBy = isUserSummary(performance.created_by)
      ? performance.created_by.first_name
      : null;

    return (
      <BaseCard
        key={`resource-${performance.id}`}
        title={performance.title}
        description={performance.description}
        createdBy={createdBy}
      >
        <BaseActions
          handleActiveSeeMore={() =>
            handleActivePerformanceReviewSeeMore(performance.id ?? 0)
          }
        />
        {canManage ? (
          <ResourceActions
            handleActiveAssign={
              canAssign
                ? () => handleActiveAssignPerformanceReview(performance.id ?? 0)
                : null
            }
            handleActiveDelete={
              canDelete
                ? () => handleActiveDeletePerformanceReview(performance.id ?? 0)
                : null
            }
            handleActiveEdit={
              canEdit
                ? () => handleActiveEditPerformanceReview(performance.id ?? 0)
                : null
            }
          />
        ) : null}
      </BaseCard>
    );
  });

  React.useEffect(() => {
    const controller = new AbortController();

    getPerformanceReviews(controller);

    return () => {
      controller.abort();
    };
  }, [getPerformanceReviews]);

  React.useEffect(() => {
    if (!tab) {
      setActiveTab("assigned");
      return;
    }

    const newTab = ["assigned", "resource"].includes(tab) ? tab : "assigned";

    setActiveTab(newTab);
  }, [tab]);

  React.useEffect(() => {
    handleFilters(activeTab);
  }, [activeTab, handleFilters]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {activePerformanceReviewSeeMore ? (
        activeTab === "assigned" ? (
          <ShowAssignedPerformanceReview
            id={activePerformanceReviewSeeMore}
            toggleModal={() => handleActivePerformanceReviewSeeMore(0)}
          />
        ) : activeTab === "resource" &&
          user?.permissions.includes("read.performance_review_resource") ? (
          <ShowResourcePerformanceReview
            id={activePerformanceReviewSeeMore}
            toggleModal={() =>
              handleActivePerformanceReviewSeeMore(
                activePerformanceReviewSeeMore
              )
            }
          />
        ) : null
      ) : null}

      {canCreatePerformanceReview &&
      user?.permissions.includes("create.performance_review_resource") ? (
        <CreatePerformanceReview
          refetchIndex={getPerformanceReviews}
          toggleModal={handleCanCreatePerformanceReview}
        />
      ) : null}

      {activeEditPerformanceReview &&
      user?.permissions.includes("update.performance_review_resource") ? (
        <EditPerformanceReview
          id={activeEditPerformanceReview}
          refetchIndex={getPerformanceReviews}
          toggleModal={() =>
            handleActiveEditPerformanceReview(activeEditPerformanceReview)
          }
        />
      ) : null}

      {activeDeletePerformanceReview &&
      user?.permissions.includes("delete.performance_review_resource") ? (
        <DeleteEntity
          route="performance-review/resource"
          label="Performance Review"
          id={activeDeletePerformanceReview}
          toggleModal={() =>
            handleActiveDeletePerformanceReview(activeDeletePerformanceReview)
          }
          refetchIndex={getPerformanceReviews}
        />
      ) : null}

      {activeAssignPerformanceReview &&
      user?.permissions.includes("assign.performance_review_resource") ? (
        <AssignPerformanceReview
          id={activeAssignPerformanceReview}
          toggleModal={() =>
            handleActiveAssignPerformanceReview(activeAssignPerformanceReview)
          }
        />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
      t:items-start t:p-4 gap-4 t:gap-8"
      >
        {user?.permissions.includes("read.performance_review_resource") ? (
          <PageTabs activeTab={activeTab} tabs={["assigned", "resource"]} />
        ) : null}

        <Filter
          searchKeyLabelPairs={SEARCH_FILTER[activeTab as keyof object]}
          search={{
            searchKey: search.searchKey,
            searchLabel: search.searchLabel,
            searchValue: search.searchValue,
            canSeeSearchDropDown: canSeeSearchDropDown,
            selectSearch: handleSelectSearch,
            onChange: handleSearch,
            toggleCanSeeSearchDropDown: toggleCanSeeSearchDropDown,
          }}
          //
          sortKeyLabelPairs={SORT_FILTER[activeTab as keyof object]}
          sort={{
            sortKey: sort.sortKey,
            isAsc: sort.isAsc,
            sortLabel: sort.sortLabel,
            canSeeSortDropDown: canSeeSortDropDown,
            toggleAsc: toggleAsc,
            toggleCanSeeSortDropDown: toggleCanSeeSortDropDown,
            selectSort: handleSelectSort,
          }}
        />

        {activeTab === "resource" &&
        user?.permissions.includes("create.performance_review_resource") ? (
          <button
            onClick={handleCanCreatePerformanceReview}
            className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                          gap-2 t:w-fit t:px-4 transition-all"
          >
            Create Performance Review <IoAdd />
          </button>
        ) : null}

        {isLoading ? (
          <PageSkeletonLoader />
        ) : (
          <div className="w-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3 gap-4">
            {activeTab === "assigned"
              ? mappedAssignedPerformanceReviews
              : activeTab === "resource"
              ? mappedResourcePerformanceReviews
              : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;
