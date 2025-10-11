"use client";

import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Filter from "@/src/components/global/filter/Filter";
import AssignLeaveType from "@/src/components/hr/leave/AssignLeaveType";
import CreateLeaveType from "@/src/components/hr/leave/CreateLeaveType";
import EditLeaveType from "@/src/components/hr/leave/EditLeaveType";

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { LeaveTypeInterface } from "@/src/interface/LeaveInterface";
import { HR_LEAVE_TYPE_SEARCH, HR_LEAVE_TYPE_SORT } from "@/src/utils/filters";
import axios, { isAxiosError } from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

import BaseCard from "@/src/components/global/base/BaseCard";
import LeaveRequestForm from "@/src/components/global/leave/LeaveRequestForm";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import HRActions from "@/src/components/hr/global/HRActions";
import { useToasts } from "@/src/context/ToastContext";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useIsLoading from "@/src/hooks/useIsLoading";
import { isUserSummary } from "@/src/utils/utils";

const HRLeave = () => {
  const [canCreateLeaveType, setCanCreateLeaveType] = React.useState(false);
  const [activeEditLeaveType, setActiveEditLeaveType] = React.useState(0);
  const [activeDeleteLeaveType, setActiveDeleteLeaveType] = React.useState(0);
  const [activeAssignLeaveType, setActiveAssignLeaveType] = React.useState(0);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = React.useState(0);

  const [leaveTypes, setLeaveTypes] = React.useState<LeaveTypeInterface[]>([]);

  const { isLoading, handleIsLoading } = useIsLoading();

  const { addToast } = useToasts();

  const {
    canSeeSearchDropDown,
    search,
    handleSearch,
    handleCanSeeSearchDropDown,
    handleSelectSearch,
  } = useSearch("type", "Leave Type");

  const {
    canSeeSortDropDown,
    sort,
    handleCanSeeSortDropDown,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("type", "Leave Type");

  const { data } = useSession({ required: true });
  const url = process.env.URL;
  const user = data?.user;

  const handleActiveEditLeaveType = (id: number) => {
    setActiveEditLeaveType((prev) => (id === prev ? 0 : id));
  };

  const handleActiveDeleteLeaveType = (id: number) => {
    setActiveDeleteLeaveType((prev) => (id === prev ? 0 : id));
  };

  const handleActiveAssignLeaveType = (id: number) => {
    setActiveAssignLeaveType((prev) => (id === prev ? 0 : id));
  };

  const handleCanCreateLeaveType = () => {
    setCanCreateLeaveType((prev) => !prev);
  };

  const handleSelectedLeaveRequest = (id: number) => {
    setSelectedLeaveRequest((prev) => (prev === id ? 0 : id));
  };

  const getLeaveTypes = React.useCallback(
    async (controller?: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token) {
          const { data: responseData } = await axios.get(
            `${url}/hr/leave_type`,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
              withCredentials: true,
              signal: controller?.signal,
            }
          );

          if (responseData.leaves) {
            setLeaveTypes(responseData.leaves);
          }
        }
      } catch (error) {
        console.log(error);

        if (isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the leave types are being retrieved";
          addToast("Leave Type Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, addToast, handleIsLoading]
  );

  const mappedLeaves = useFilterAndSort(leaveTypes, search, sort).map(
    (leave, index) => {
      const leaveId = leave.id ?? 0; // leave ids in this page have leaveids (from db)
      const createdBy = isUserSummary(leave.created_by)
        ? leave.created_by.first_name
        : null;
      return (
        <BaseCard
          key={index}
          title={leave.type}
          description={leave.description}
          createdBy={createdBy}
        >
          <HRActions
            handleActiveAssign={() => handleActiveAssignLeaveType(leaveId)}
            handleActiveEdit={() => handleActiveEditLeaveType(leaveId)}
            handleActiveDelete={() => handleActiveDeleteLeaveType(leaveId)}
          />
        </BaseCard>
      );
    }
  );

  React.useEffect(() => {
    const controller = new AbortController();

    getLeaveTypes(controller);

    return () => {
      controller.abort();
    };
  }, [getLeaveTypes]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateLeaveType ? (
        <CreateLeaveType
          toggleModal={handleCanCreateLeaveType}
          refetchIndex={getLeaveTypes}
        />
      ) : null}

      {activeEditLeaveType ? (
        <EditLeaveType
          id={activeEditLeaveType}
          refetchIndex={getLeaveTypes}
          toggleModal={() => handleActiveEditLeaveType(activeEditLeaveType)}
        />
      ) : null}

      {activeDeleteLeaveType ? (
        <DeleteEntity
          route="leave_type"
          label="Leave"
          id={activeDeleteLeaveType}
          refetchIndex={getLeaveTypes}
          toggleModal={() => handleActiveDeleteLeaveType(activeDeleteLeaveType)}
        />
      ) : null}

      {selectedLeaveRequest ? (
        <LeaveRequestForm
          toggleModal={() => handleSelectedLeaveRequest(0)}
          id={selectedLeaveRequest}
        />
      ) : null}

      {activeAssignLeaveType ? (
        <AssignLeaveType
          id={activeAssignLeaveType}
          toggleModal={() => handleActiveAssignLeaveType(activeAssignLeaveType)}
        />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          searchKeyLabelPairs={HR_LEAVE_TYPE_SEARCH}
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
          sortKeyLabelPairs={HR_LEAVE_TYPE_SORT}
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
          onClick={handleCanCreateLeaveType}
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-40 transition-all"
        >
          Create Leave
          <IoAdd className="text-lg" />
        </button>

        {isLoading ? (
          <PageSkeletonLoader />
        ) : (
          <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
            {mappedLeaves}
          </div>
        )}
      </div>
    </div>
  );
};

export default HRLeave;
