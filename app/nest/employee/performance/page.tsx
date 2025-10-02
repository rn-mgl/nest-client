"use client";
import ShowPerformanceReview from "@/src/components/employee/performance/ShowPerformanceReview";
import BaseActions from "@/src/components/global/base/BaseActions";
import BaseCard from "@/src/components/global/base/BaseCard";
import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { UserPerformanceReviewInterface } from "@/src/interface/PerformanceReviewInterface";
import {
  EMPLOYEE_PERFORMANCE_REVIEW_SEARCH,
  EMPLOYEE_PERFORMANCE_REVIEW_SORT,
} from "@/src/utils/filters";
import { isUserSummary } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Performance = () => {
  const [performanceReviews, setPerformanceReviews] = React.useState<
    UserPerformanceReviewInterface[]
  >([]);
  const [activePerformanceReviewSeeMore, setActivePerformanceReviewSeeMore] =
    React.useState(0);
  const [isPending, startTransition] = React.useTransition();

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const {
    search,
    canSeeSearchDropDown,
    handleCanSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
  } = useSearch("title", "Title");

  const {
    sort,
    canSeeSortDropDown,
    handleCanSeeSortDropDown,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("title", "Title");

  const handleActivePerformanceReviewSeeMore = (id: number) => {
    setActivePerformanceReviewSeeMore((prev) => (prev === id ? 0 : id));
  };

  const getPerformanceReviews = React.useCallback(
    async (controller?: AbortController) => {
      startTransition(async () => {
        try {
          if (user?.token) {
            const { data: responseData } = await axios.get(
              `${url}/employee/employee_performance_review`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
                withCredentials: true,
                signal: controller?.signal,
              }
            );

            if (responseData.performance_reviews) {
              setPerformanceReviews(responseData.performance_reviews);
            }
          }
        } catch (error) {
          console.log(error);
        }
      });
    },
    [url, user?.token]
  );

  const mappedPerformanceReviews = performanceReviews.map(
    (performance, index) => {
      const assignedBy = isUserSummary(performance.assigned_by)
        ? performance.assigned_by.first_name
        : null;

      return (
        <BaseCard
          key={index}
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
    }
  );

  React.useEffect(() => {
    const controller = new AbortController();

    getPerformanceReviews(controller);

    return () => {
      controller.abort();
    };
  }, [getPerformanceReviews]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {activePerformanceReviewSeeMore ? (
        <ShowPerformanceReview
          id={activePerformanceReviewSeeMore}
          toggleModal={() => handleActivePerformanceReviewSeeMore(0)}
        />
      ) : null}
      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
      t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          searchKeyLabelPairs={EMPLOYEE_PERFORMANCE_REVIEW_SEARCH}
          search={{
            searchKey: search.searchKey,
            searchLabel: search.searchLabel,
            searchValue: search.searchValue,
            canSeeSearchDropDown: canSeeSearchDropDown,
            selectSearch: handleSelectSearch,
            onChange: handleSearch,
            toggleCanSeeSearchDropDown: handleCanSeeSearchDropDown,
          }}
          //
          sortKeyLabelPairs={EMPLOYEE_PERFORMANCE_REVIEW_SORT}
          sort={{
            sortKey: sort.sortKey,
            isAsc: sort.isAsc,
            sortLabel: sort.sortLabel,
            canSeeSortDropDown: canSeeSortDropDown,
            toggleAsc: handleToggleAsc,
            toggleCanSeeSortDropDown: handleCanSeeSortDropDown,
            selectSort: handleSelectSort,
          }}
        />

        {isPending ? (
          <PageSkeletonLoader />
        ) : (
          <div className="w-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3 gap-4">
            {mappedPerformanceReviews}
          </div>
        )}
      </div>
    </div>
  );
};

export default Performance;
