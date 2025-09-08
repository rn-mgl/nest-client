"use client";
import ShowPerformanceReview from "@/src/components/employee/performance/ShowPerformanceReview";
import Filter from "@/src/components/global/filter/Filter";
import PerformanceReviewCard from "@/src/components/global/performance/PerformanceReviewCard";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  EmployeePerformanceReviewInterface,
  PerformanceReviewInterface,
} from "@/src/interface/PerformanceReviewInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  EMPLOYEE_PERFORMANCE_REVIEW_SEARCH,
  EMPLOYEE_PERFORMANCE_REVIEW_SORT,
} from "@/src/utils/filters";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Performance = () => {
  const [performanceReviews, setPerformanceReviews] = React.useState<
    (PerformanceReviewInterface &
      UserInterface &
      EmployeePerformanceReviewInterface)[]
  >([]);
  const [activePerformanceReviewSeeMore, setActivePerformanceReviewSeeMore] =
    React.useState(0);

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

  const getPerformanceReviews = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/employee_performance_review`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
            params: { ...search, ...sort },
          }
        );

        if (responseData.performance_reviews) {
          setPerformanceReviews(responseData.performance_reviews);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, search, sort]);

  const mappedPerformanceReviews = performanceReviews.map(
    (performance, index) => {
      return (
        <PerformanceReviewCard
          key={index}
          role={user?.role ?? ""}
          createdBy={false}
          //
          title={performance.title}
          description={performance.description}
          status={performance.status}
          //
          id={performance.id}
          email={performance.email}
          email_verified_at={performance.email_verified_at}
          first_name={performance.first_name}
          last_name={performance.last_name}
          //
          handleActiveSeeMore={() =>
            handleActivePerformanceReviewSeeMore(
              performance.user_performance_review_id ?? 0
            )
          }
        />
      );
    }
  );

  React.useEffect(() => {
    getPerformanceReviews();
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
        <div className="w-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3 gap-4">
          {mappedPerformanceReviews}
        </div>
      </div>
    </div>
  );
};

export default Performance;
