"use client";

import Filter from "@/src/components/global/Filter";
import CreatePerformanceReview from "@/src/components/hr/performance/CreatePerformanceReview";
import DeletePerformanceReview from "@/src/components/hr/performance/DeletePerformanceReview";
import EditPerformanceReview from "@/src/components/hr/performance/EditPerformanceReview";
import ShowPerformanceReview from "@/src/components/hr/performance/ShowPerformanceReview";
import useCategory from "@/src/hooks/useCategory";
import useFilters from "@/src/hooks/useFilters";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { PerformanceReviewInterface } from "@/src/interface/PerformanceReviewInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import useGlobalContext from "@/src/utils/context";
import {
  HR_PERFORMANCE_CATEGORY,
  HR_PERFORMANCE_SEARCH,
  HR_PERFORMANCE_SORT,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import {
  IoAdd,
  IoArrowForward,
  IoEllipsisVertical,
  IoPencil,
  IoTrash,
} from "react-icons/io5";

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

  const { showFilters, handleShowFilters } = useFilters();
  const {
    search,
    canShowSearch,
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

  const getPerformanceReviews = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: allPerformanceReviews } = await axios.get(
          `${url}/hr/performance_review`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
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
    const activeMenu =
      activePerformanceReviewMenu === performance.performance_review_id;
    const createdBy = performance.created_by === user?.current;
    return (
      <div
        key={index}
        className="w-full min-h-[17rem] p-4 rounded-md bg-neutral-100 flex 
                       flex-col items-center justify-start gap-4 relative max-w-full transition-all"
      >
        <div className="flex flex-row items-start justify-between w-full">
          <div className="flex flex-col items-start justify-start">
            <p className="font-bold truncate">{performance.title}</p>
          </div>

          <button
            onClick={() =>
              performance.performance_review_id &&
              handleActivePerformanceReviewMenu(
                performance.performance_review_id
              )
            }
            className="p-2 rounded-full bg-neutral-100 transition-all"
          >
            <IoEllipsisVertical
              className={`${
                activeMenu ? "text-accent-blue" : "text-neutral-900"
              }`}
            />
          </button>
        </div>

        <div className="w-full h-40 max-h-40 min-h-40 flex flex-col items-center justify-start overflow-y-auto bg-neutral-200 p-2 rounded-sm">
          <p className="text-sm w-full text-wrap break-words">
            {performance.description}
          </p>
        </div>

        <button
          onClick={() =>
            performance.performance_review_id &&
            handleActivePerformanceReviewSeeMore(
              performance.performance_review_id
            )
          }
          className="text-xs hover:underline transition-all underline-offset-2 flex flex-row items-center justify-start gap-1"
        >
          See More <IoArrowForward />
        </button>

        {activeMenu ? (
          <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
            <button
              onClick={handleCanEditPerformanceReview}
              className="w-full p-1 rounded-sm text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoPencil className="text-accent-blue" />
              Edit
            </button>

            {createdBy ? (
              <button
                onClick={handleCanDeletePerformanceReview}
                className="w-full p-1 rounded-sm text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
              >
                <IoTrash className="text-red-600" />
                Delete
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
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

      {activePerformanceReviewSeeMore ? (
        <ShowPerformanceReview
          id={activePerformanceReviewSeeMore}
          setActiveModal={handleActivePerformanceReviewSeeMore}
        />
      ) : null}
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-screen-l-l p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          showSearch={true}
          showSort={true}
          showCategory={false}
          searchKey={search.searchKey}
          searchLabel={search.searchLabel}
          searchValue={search.searchValue}
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
