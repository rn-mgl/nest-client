"use client";

import Filter from "@/src/components/global/Filter";
import CreateLeave from "@/src/components/hr/leaveType/CreateLeaveType";
import DeleteLeave from "@/src/components/hr/leaveType/DeleteLeaveType";
import EditLeave from "@/src/components/hr/leaveType/EditLeaveType";
import useCategory from "@/src/hooks/useCategory";
import useFilters from "@/src/hooks/useFilters";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { LeaveTypeInterface } from "@/src/interface/LeaveInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import useGlobalContext from "@/src/utils/context";
import {
  HR_LEAVE_CATEGORY,
  HR_LEAVE_SEARCH,
  HR_LEAVE_SORT,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoEllipsisVertical, IoPencil, IoTrash } from "react-icons/io5";

const HRLeave = () => {
  const [canCreateLeave, setCanCreateLeave] = React.useState(false);
  const [canEditLeave, setCanEditLeave] = React.useState(false);
  const [canDeleteLeave, setCanDeleteLeave] = React.useState(false);
  const [activeLeaveMenu, setActiveLeaveMenu] = React.useState(0);
  const [leaves, setLeaves] = React.useState<
    Array<LeaveTypeInterface & UserInterface>
  >([]);

  const { showFilters, handleShowFilters } = useFilters();
  const {
    search,
    canShowSearch,
    handleSearch,
    handleCanShowSearch,
    handleSelectSearch,
  } = useSearch("type", "Leave Type");
  const {
    canShowSort,
    sort,
    handleCanShowSort,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("type", "Leave Type");
  // not being used
  const {
    canShowCategories,
    category,
    handleCanShowCategories,
    handleSelectCategory,
  } = useCategory("", "", "");
  const { data } = useSession({ required: true });
  const { url } = useGlobalContext();
  const user = data?.user;

  const handleActiveLeaveMenu = (id: number) => {
    setActiveLeaveMenu((prev) => (prev === id ? 0 : id));
  };

  const handleCanEditLeave = () => {
    setCanEditLeave((prev) => !prev);
  };

  const handleCanDeleteLeave = () => {
    setCanDeleteLeave((prev) => !prev);
  };

  const getLeaves = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken(url);

      if (token && user?.token) {
        const { data: allLeaves } = await axios.get(`${url}/hr/leave_type`, {
          headers: {
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            Authorization: `Bearer ${user?.token}`,
          },
          withCredentials: true,
          params: { ...search, ...sort },
        });

        setLeaves(allLeaves.leaves);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, search, sort]);

  const handleCanCreateLeave = () => {
    setCanCreateLeave((prev) => !prev);
  };

  const mappedLeaves = leaves.map((leave, index) => {
    const createdBy = leave.created_by === user?.current;
    return (
      <div
        key={index}
        className="w-full h-full p-4 rounded-md bg-neutral-100 flex flex-col items-start justify-start gap-4 relative  max-h-56 max-w-full"
      >
        <div className="flex flex-row items-start justify-between w-full">
          <div className="flex flex-col items-start justify-start">
            <p className="font-bold truncate">{leave.type}</p>
            <p className="text-xs">
              created by {createdBy ? "you" : `${leave.first_name}`}
            </p>
          </div>

          <button
            onClick={() =>
              leave.leave_id && handleActiveLeaveMenu(leave.leave_id)
            }
            className="p-2 rounded-full bg-neutral-100 transition-all"
          >
            <IoEllipsisVertical
              className={`${
                activeLeaveMenu === leave.leave_id
                  ? "text-accent-blue"
                  : "text-neutral-900"
              }`}
            />
          </button>
        </div>

        <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto">
          <p className="text-sm w-full text-wrap break-words">
            {leave.description}
          </p>
        </div>

        {activeLeaveMenu === leave.leave_id ? (
          <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
            <button
              onClick={handleCanEditLeave}
              className="w-full p-1 rounded-sm text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoPencil className="text-accent-blue" />
              Edit
            </button>

            {createdBy ? (
              <button
                onClick={handleCanDeleteLeave}
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
    getLeaves();
  }, [getLeaves]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateLeave ? (
        <CreateLeave
          toggleModal={handleCanCreateLeave}
          refetchIndex={getLeaves}
        />
      ) : null}

      {canEditLeave ? (
        <EditLeave
          id={activeLeaveMenu}
          refetchIndex={getLeaves}
          toggleModal={handleCanEditLeave}
        />
      ) : null}

      {canDeleteLeave ? (
        <DeleteLeave
          id={activeLeaveMenu}
          refetchIndex={getLeaves}
          toggleModal={handleCanDeleteLeave}
        />
      ) : null}
      <div
        className="w-full flex flex-col items-center justify-start max-w-screen-l-l p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          showSearch={true}
          showSort={true}
          showCategory={false}
          searchKey={search.searchKey}
          searchLabel={search.searchLabel}
          searchValue={search.searchValue}
          searchKeyLabelPairs={HR_LEAVE_SEARCH}
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
          sortKeyLabelPairs={HR_LEAVE_SORT}
          toggleAsc={handleToggleAsc}
          selectSort={handleSelectSort}
          toggleShowSort={handleCanShowSort}
          //
          categoryLabel={category.categoryLabel}
          canShowCategories={canShowCategories}
          categoryKeyValuePairs={HR_LEAVE_CATEGORY}
          toggleShowCategories={handleCanShowCategories}
          selectCategory={handleSelectCategory}
        />

        <button
          onClick={handleCanCreateLeave}
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-40 transition-all"
        >
          Create Leave
          <IoAdd className="text-lg" />
        </button>

        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedLeaves}
        </div>
      </div>
    </div>
  );
};

export default HRLeave;
