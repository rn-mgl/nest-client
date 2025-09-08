"use client";

import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Filter from "@/src/components/global/filter/Filter";
import LeaveCard from "@/src/components/global/leave/LeaveCard";
import AssignLeaveType from "@/src/components/hr/leave/AssignLeaveType";
import CreateLeaveType from "@/src/components/hr/leave/CreateLeaveType";
import EditLeaveType from "@/src/components/hr/leave/EditLeaveType";

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  LeaveBalanceInterface,
  LeaveRequestInterface,
  LeaveTypeInterface,
} from "@/src/interface/LeaveInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  HR_LEAVE_BALANCE_SORT,
  HR_LEAVE_REQUEST_CATEGORY,
  HR_LEAVE_REQUEST_SEARCH,
  HR_LEAVE_REQUEST_SORT,
  HR_LEAVE_TYPE_SEARCH,
  HR_LEAVE_TYPE_SORT,
} from "@/src/utils/filters";
import axios from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";

import Tabs from "@/src/components/global/Tabs";
import Table from "@/src/components/global/field/Table";
import EditLeaveRequest from "@/src/components/global/leave/EditLeaveRequest";
import LeaveBalanceCard from "@/src/components/global/leave/LeaveBalanceCard";
import LeaveRequestForm from "@/src/components/global/leave/LeaveRequestForm";
import useCategory from "@/src/hooks/useCategory";
import { usePathname, useSearchParams } from "next/navigation";

const HRLeave = () => {
  const [canCreateLeaveType, setCanCreateLeaveType] = React.useState(false);
  const [canEditLeaveType, setCanEditLeaveType] = React.useState(false);
  const [canDeleteLeaveType, setCanDeleteLeaveType] = React.useState(false);
  const [canAssignLeaveType, setCanAssignLeaveType] = React.useState(false);
  const [activeLeaveTypeMenu, setActiveLeaveTypeMenu] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("types");
  const [selectedLeaveRequest, setSelectedLeaveRequest] = React.useState(0);
  const [canEditLeaveRequest, setCanEditLeaveRequest] = React.useState(0);
  const [canDeleteLeaveRequest, setCanDeleteLeaveRequest] = React.useState(0);
  const [leaveTypes, setLeaveTypes] = React.useState<
    Array<LeaveTypeInterface & UserInterface>
  >([]);
  const [leaveBalances, setLeaveBalances] = React.useState<
    (LeaveTypeInterface & LeaveBalanceInterface)[]
  >([]);
  const [leaveRequests, setLeaveRequest] = React.useState<
    (LeaveTypeInterface & LeaveRequestInterface)[]
  >([]);

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

  const {
    category,
    canSeeCategoryDropDown,
    handleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("status", "all");

  const searchFilters = {
    types: HR_LEAVE_TYPE_SEARCH,
    requests: HR_LEAVE_REQUEST_SEARCH,
  };

  const sortFilters = {
    types: HR_LEAVE_TYPE_SORT,
    balances: HR_LEAVE_BALANCE_SORT,
    requests: HR_LEAVE_REQUEST_SORT,
  };

  const categoryFilters = {
    requests: HR_LEAVE_REQUEST_CATEGORY,
  };

  const { data } = useSession({ required: true });
  const url = process.env.URL;
  const user = data?.user;

  const currentPath = usePathname();
  const params = useSearchParams();
  const tab = params?.get("tab");

  const handleActiveLeaveTypeMenu = (id: number) => {
    setActiveLeaveTypeMenu((prev) => (prev === id ? 0 : id));
  };

  const handleCanEditLeaveType = () => {
    setCanEditLeaveType((prev) => !prev);
  };

  const handleCanDeleteLeaveType = () => {
    setCanDeleteLeaveType((prev) => !prev);
  };

  const handleCanAssignLeaveType = () => {
    setCanAssignLeaveType((prev) => !prev);
  };

  const handleCanEditLeaveRequest = (id: number) => {
    setCanEditLeaveRequest((prev) => (prev === id ? 0 : id));
  };

  const handleCanDeleteLeaveRequest = (id: number) => {
    setCanDeleteLeaveRequest((prev) => (prev === id ? 0 : id));
  };

  const handleCanCreateLeaveType = () => {
    setCanCreateLeaveType((prev) => !prev);
  };

  const handleSelectedLeaveRequest = (id: number) => {
    setSelectedLeaveRequest((prev) => (prev === id ? 0 : id));
  };

  const getLeaveTypes = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get(`${url}/hr/leave_type`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          withCredentials: true,
          params: { ...search, ...sort },
        });

        if (responseData.leaves) {
          setLeaveTypes(responseData.leaves);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, search, sort]);

  const getLeaveBalances = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/hr/leave_balance`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
            params: { ...search, ...sort },
          }
        );

        if (responseData.balances) {
          setLeaveBalances(responseData.balances);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, search, sort]);

  const getLeaveRequest = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/hr/leave_request`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
            params: { ...search, ...sort, ...category },
          }
        );

        if (responseData.requests) {
          setLeaveRequest(responseData.requests);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, search, sort, category]);

  const getPageData = React.useCallback(
    async (tab: string) => {
      switch (tab) {
        case "types":
          getLeaveTypes();
          break;
        case "balances":
          getLeaveBalances();
          break;
        case "requests":
          getLeaveRequest();
          break;
      }
    },
    [getLeaveTypes, getLeaveBalances, getLeaveRequest]
  );

  const mappedLeaves = leaveTypes.map((leave, index) => {
    const leaveId = leave.leave_type_id as number; // leave ids in this page have leaveids (from db)
    const activeMenu = activeLeaveTypeMenu === leaveId;
    const createdBy = leave.created_by === user?.current;
    return (
      <LeaveCard
        role={user?.role ?? ""}
        key={index}
        activeMenu={activeMenu}
        createdBy={createdBy}
        //
        type={leave.type}
        description={leave.description}
        //
        first_name={leave.first_name}
        last_name={leave.last_name}
        email={leave.email}
        email_verified_at={leave.email_verified_at}
        id={leave.id}
        //
        handleActiveMenu={() => handleActiveLeaveTypeMenu(leaveId)}
        handleCanAssign={handleCanAssignLeaveType}
        handleCanDelete={handleCanDeleteLeaveType}
        handleCanEdit={handleCanEditLeaveType}
      />
    );
  });

  const mappedLeaveBalances = leaveBalances.map((balance, index) => {
    return (
      <LeaveBalanceCard
        key={index}
        //
        type={balance.type}
        description={balance.description}
        balance={balance.balance}
        //
        toggleSelectedLeaveRequest={() =>
          handleSelectedLeaveRequest(balance.leave_type_id ?? 0)
        }
      />
    );
  });

  const mappedLeaveRequests = leaveRequests.map((request) => {
    const requestedAtDate = request.requested_at
      ? new Date(request.requested_at).toLocaleDateString()
      : "";
    const requestedAtTime = request.requested_at
      ? new Date(request.requested_at).toLocaleTimeString()
      : "";

    const startDate = new Date(request.start_date).toLocaleDateString();
    const startTime = new Date(request.start_date).toLocaleTimeString();

    const endDate = new Date(request.end_date).toLocaleDateString();
    const endTime = new Date(request.end_date).toLocaleTimeString();

    return {
      type: request.type,
      status: (
        <span className="capitalize">
          {request.status.replaceAll("_", " ")}
        </span>
      ),
      requested_at: `${requestedAtDate} ${requestedAtTime}`,
      start_date: `${startDate} ${startTime}`,
      end_date: `${endDate} ${endTime}`,
      reason: request.reason,
      action: (
        <div className="w-full flex flex-row items-center justify-start gap-2">
          <button
            onClick={() =>
              handleCanEditLeaveRequest(request.leave_request_id ?? 0)
            }
            className="p-2 rounded-md bg-accent-blue text-neutral-100"
          >
            <IoPencil />
          </button>
          <button
            onClick={() =>
              handleCanDeleteLeaveRequest(request.leave_request_id ?? 0)
            }
            className="p-2 rounded-md bg-red-600 text-neutral-100"
          >
            <IoTrash />
          </button>
        </div>
      ),
    };
  });

  React.useEffect(() => {
    getPageData(activeTab);
  }, [getPageData, activeTab]);

  React.useEffect(() => {
    setActiveTab(tab ?? "types");
  }, [setActiveTab, tab]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateLeaveType ? (
        <CreateLeaveType
          toggleModal={handleCanCreateLeaveType}
          refetchIndex={getLeaveTypes}
        />
      ) : null}

      {canEditLeaveType ? (
        <EditLeaveType
          id={activeLeaveTypeMenu}
          refetchIndex={getLeaveTypes}
          toggleModal={handleCanEditLeaveType}
        />
      ) : null}

      {canDeleteLeaveType ? (
        <DeleteEntity
          route="leave_type"
          label="Leave"
          id={activeLeaveTypeMenu}
          refetchIndex={getLeaveTypes}
          toggleModal={handleCanDeleteLeaveType}
        />
      ) : null}

      {selectedLeaveRequest ? (
        <LeaveRequestForm
          toggleModal={() => handleSelectedLeaveRequest(0)}
          id={selectedLeaveRequest}
        />
      ) : null}

      {canAssignLeaveType ? (
        <AssignLeaveType
          id={activeLeaveTypeMenu}
          toggleModal={handleCanAssignLeaveType}
        />
      ) : null}

      {canEditLeaveRequest ? (
        <EditLeaveRequest
          toggleModal={() => handleCanEditLeaveRequest(0)}
          id={canEditLeaveRequest}
          refetchIndex={getLeaveRequest}
        />
      ) : null}

      {canDeleteLeaveRequest ? (
        <DeleteEntity
          route="leave_request"
          toggleModal={() => handleCanDeleteLeaveRequest(0)}
          id={canDeleteLeaveRequest}
          label="Leave Request"
          refetchIndex={getLeaveRequest}
        />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Tabs
          activeTab={activeTab}
          path={currentPath ?? ""}
          tabs={["types", "balances", "requests"]}
        />

        <Filter
          searchKeyLabelPairs={searchFilters[activeTab as keyof object]}
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
          sortKeyLabelPairs={sortFilters[activeTab as keyof object]}
          sort={{
            sortKey: sort.sortKey,
            sortLabel: sort.sortLabel,
            isAsc: sort.isAsc,
            canSeeSortDropDown: canSeeSortDropDown,
            toggleAsc: handleToggleAsc,
            selectSort: handleSelectSort,
            toggleCanSeeSortDropDown: handleCanSeeSortDropDown,
          }}
          //
          categoryKeyValuePairs={categoryFilters[activeTab as keyof object]}
          category={{
            categoryValue: category.categoryValue,
            canSeeCategoryDropDown: canSeeCategoryDropDown,
            selectCategory: handleSelectCategory,
            toggleCanSeeCategoryDropDown: handleCanSeeCategoryDropDown,
          }}
        />

        {activeTab === "types" ? (
          <React.Fragment>
            <button
              onClick={handleCanCreateLeaveType}
              className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-40 transition-all"
            >
              Create Leave
              <IoAdd className="text-lg" />
            </button>
            <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
              {mappedLeaves}
            </div>
          </React.Fragment>
        ) : activeTab === "balances" ? (
          <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
            {mappedLeaveBalances}
          </div>
        ) : activeTab === "requests" ? (
          <div className="w-full flex flex-col items-center justify-start">
            <Table
              color="blue"
              contents={mappedLeaveRequests}
              headers={[
                "Type",
                "Status",
                "Requested At",
                "Start Date",
                "End Date",
                "Reason",
                "Action",
              ]}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HRLeave;
