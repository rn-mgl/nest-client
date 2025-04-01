"use client";

import Filter from "@/src/components/global/Filter";
import AssignPerformanceReview from "@/src/components/hr/performance/AssignPerformanceReview";
import CreatePerformanceReview from "@/src/components/hr/performance/CreatePerformanceReview";
import DeletePerformanceReview from "@/src/components/hr/performance/DeletePerformanceReview";
import EditPerformanceReview from "@/src/components/hr/performance/EditPerformanceReview";
import PerformanceReviewCard from "@/src/components/hr/performance/PerformanceReviewCard";
import ShowPerformanceReview from "@/src/components/hr/performance/ShowPerformanceReview";
import useCategory from "@/src/hooks/useCategory";
import useFilters from "@/src/hooks/useFilters";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { PerformanceReviewInterface } from "@/src/interface/PerformanceReviewInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  HR_PERFORMANCE_CATEGORY,
  HR_PERFORMANCE_SEARCH,
  HR_PERFORMANCE_SORT,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const PerformanceReview = () => {
  const [performances, setPerformanceReviews] = React.useState<
    Array<PerformanceReviewInterface & UserInterface>
  >([]);
  const [canCreatePerformanceReview, setCanCreatePerformanceReview] =
    React.useState(false);
  const [activePerformanceReviewMenu, setActivePerformanceReviewMenu] =
    React.useState(0);
  const [activePerformanceReviewSeeMore, setActivePerformanceReviewSeeMore] =
    React.useState(0);
  const [canEditPerformanceReview, setCanEditPerformanceReview] =
    React.useState(false);
  const [canDeletePerformanceReview, setCanDeletePerformanceReview] =
    React.useState(false);
  const [canAssignPerformanceReview, setCanAssignPerformanceReview] =
    React.useState(false);

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

  const handleCanCreatePerformanceReview = () => {
    setCanCreatePerformanceReview((prev) => !prev);
  };

  const handleActivePerformanceReviewMenu = (id: number) => {
    setActivePerformanceReviewMenu((prev) => (prev === id ? 0 : id));
  };

  const handleActivePerformanceReviewSeeMore = (id: number) => {
    setActivePerformanceReviewSeeMore((prev) => (prev === id ? 0 : id));
  };

  const handleCanEditPerformanceReview = () => {
    setCanEditPerformanceReview((prev) => !prev);
  };

  const handleCanDeletePerformanceReview = () => {
    setCanDeletePerformanceReview((prev) => !prev);
  };

  const handleCanAssignPerformanceReview = () => {
    setCanAssignPerformanceReview((prev) => !prev);
  };

  const getPerformanceReviews = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: allPerformanceReviews } = await axios.get(
          `${url}/hr/performance_review`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "X-CSRF-TOKEN": token,
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

  const mappedPerformanceReviews = performances.map((performance, index) => {
    const performanceReviewId = performance.performance_review_id as number;
    const activeMenu = activePerformanceReviewMenu === performanceReviewId;
    const createdBy = performance.created_by === user?.current;
    return (
      <PerformanceReviewCard
        role={user?.role as string}
        key={index}
        activeMenu={activeMenu}
        createdBy={createdBy}
        performance={performance}
        handleActiveMenu={() =>
          handleActivePerformanceReviewMenu(performanceReviewId)
        }
        handleActiveSeeMore={() =>
          handleActivePerformanceReviewSeeMore(performanceReviewId)
        }
        handleCanAssign={handleCanAssignPerformanceReview}
        handleCanDelete={handleCanDeletePerformanceReview}
        handleCanEdit={handleCanEditPerformanceReview}
      />
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

      {canEditPerformanceReview ? (
        <EditPerformanceReview
          id={activePerformanceReviewMenu}
          refetchIndex={getPerformanceReviews}
          toggleModal={handleCanEditPerformanceReview}
        />
      ) : null}

      {canDeletePerformanceReview ? (
        <DeletePerformanceReview
          id={activePerformanceReviewMenu}
          refetchIndex={getPerformanceReviews}
          toggleModal={handleCanDeletePerformanceReview}
        />
      ) : null}

      {canAssignPerformanceReview ? (
        <AssignPerformanceReview
          id={activePerformanceReviewMenu}
          toggleModal={handleCanAssignPerformanceReview}
        />
      ) : null}

      {activePerformanceReviewSeeMore ? (
        <ShowPerformanceReview
          id={activePerformanceReviewSeeMore}
          setActiveModal={handleActivePerformanceReviewSeeMore}
        />
      ) : null}

      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          showSearch={true}
          showSort={true}
          showCategory={false}
          searchKey={debounceSearch.searchKey}
          searchLabel={debounceSearch.searchLabel}
          searchValue={debounceSearch.searchValue}
          searchKeyLabelPairs={HR_PERFORMANCE_SEARCH}
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
          sortKeyLabelPairs={HR_PERFORMANCE_SORT}
          toggleAsc={handleToggleAsc}
          selectSort={handleSelectSort}
          toggleShowSort={handleCanShowSort}
          //
          categoryLabel={category.categoryLabel}
          canShowCategories={canShowCategories}
          categoryKeyValuePairs={HR_PERFORMANCE_CATEGORY}
          toggleShowCategories={handleCanShowCategories}
          selectCategory={handleSelectCategory}
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
