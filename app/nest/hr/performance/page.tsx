"use client";

import BaseActions from "@/src/components/global/base/BaseActions";
import BaseCard from "@/src/components/global/base/BaseCard";
import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Filter from "@/src/components/global/filter/Filter";
import HRActions from "@/src/components/hr/global/HRActions";
import AssignPerformanceReview from "@/src/components/hr/performance/AssignPerformanceReview";
import CreatePerformanceReview from "@/src/components/hr/performance/CreatePerformanceReview";
import EditPerformanceReview from "@/src/components/hr/performance/EditPerformanceReview";
import ShowPerformanceReview from "@/src/components/hr/performance/ShowPerformanceReview";

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { PerformanceReviewInterface } from "@/src/interface/PerformanceReviewInterface";
import {
  HR_PERFORMANCE_SEARCH,
  HR_PERFORMANCE_SORT,
} from "@/src/utils/filters";
import { isUserSummary } from "@/src/utils/utils";
import axios from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const PerformanceReview = () => {
  const [performances, setPerformanceReviews] = React.useState<
    PerformanceReviewInterface[]
  >([]);
  const [canCreatePerformanceReview, setCanCreatePerformanceReview] =
    React.useState(false);

  const [activePerformanceReviewSeeMore, setActivePerformanceReviewSeeMore] =
    React.useState(0);
  const [activeEditPerformanceReview, setActiveEditPerformanceReview] =
    React.useState(0);
  const [activeDeletePerformanceReview, setActiveDeletePerformanceReview] =
    React.useState(0);
  const [activeAssignPerformanceReview, setActiveAssignPerformanceReview] =
    React.useState(0);

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

  const getPerformanceReviews = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: allPerformanceReviews } = await axios.get(
          `${url}/hr/performance_review`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
            params: { ...search, ...sort },
          }
        );

        if (allPerformanceReviews.performances) {
          setPerformanceReviews(allPerformanceReviews.performances);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, search, sort]);

  const mappedPerformanceReviews = performances.map((performance) => {
    const performanceReviewId = performance.id ?? 0;
    const createdBy = isUserSummary(performance.created_by)
      ? performance.created_by.first_name
      : null;

    return (
      <BaseCard
        key={`${performance.title}-${performance.id}`}
        //
        title={performance.title}
        description={performance.description}
        createdBy={createdBy}
      >
        <BaseActions
          handleActiveSeeMore={() =>
            handleActivePerformanceReviewSeeMore(performanceReviewId)
          }
        />
        <HRActions
          handleActiveAssign={() =>
            handleActiveAssignPerformanceReview(performanceReviewId)
          }
          handleActiveDelete={() =>
            handleActiveDeletePerformanceReview(performanceReviewId)
          }
          handleActiveEdit={() =>
            handleActiveEditPerformanceReview(performanceReviewId)
          }
        />
      </BaseCard>
    );
  });

  React.useEffect(() => {
    getPerformanceReviews();
  }, [getPerformanceReviews]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreatePerformanceReview ? (
        <CreatePerformanceReview
          refetchIndex={getPerformanceReviews}
          toggleModal={handleCanCreatePerformanceReview}
        />
      ) : null}

      {activeEditPerformanceReview ? (
        <EditPerformanceReview
          id={activeEditPerformanceReview}
          refetchIndex={getPerformanceReviews}
          toggleModal={() =>
            handleActiveEditPerformanceReview(activeEditPerformanceReview)
          }
        />
      ) : null}

      {activeDeletePerformanceReview ? (
        <DeleteEntity
          route="performance_review"
          label="Performance Review"
          id={activeDeletePerformanceReview}
          toggleModal={() =>
            handleActiveDeletePerformanceReview(activeDeletePerformanceReview)
          }
          refetchIndex={getPerformanceReviews}
        />
      ) : null}

      {activeAssignPerformanceReview ? (
        <AssignPerformanceReview
          id={activeAssignPerformanceReview}
          toggleModal={() =>
            handleActiveAssignPerformanceReview(activeAssignPerformanceReview)
          }
        />
      ) : null}

      {activePerformanceReviewSeeMore ? (
        <ShowPerformanceReview
          id={activePerformanceReviewSeeMore}
          toggleModal={() =>
            handleActivePerformanceReviewSeeMore(activePerformanceReviewSeeMore)
          }
        />
      ) : null}

      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          searchKeyLabelPairs={HR_PERFORMANCE_SEARCH}
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
          sortKeyLabelPairs={HR_PERFORMANCE_SORT}
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
          onClick={handleCanCreatePerformanceReview}
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-fit t:px-4 transition-all"
        >
          Create Performance Review <IoAdd />
        </button>

        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedPerformanceReviews}
        </div>
      </div>
    </div>
  );
};

export default PerformanceReview;
