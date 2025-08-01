"use client";

import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Table from "@/src/components/global/field/Table";
import Filter from "@/src/components/global/filter/Filter";
import EditLeaveRequest from "@/src/components/global/leave/EditLeaveRequest";
import LeaveBalanceCard from "@/src/components/global/leave/LeaveBalanceCard";
import LeaveRequestForm from "@/src/components/global/leave/LeaveRequestForm";
import Tabs from "@/src/components/global/Tabs";
import useCategory from "@/src/hooks/useCategory";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  LeaveBalanceInterface,
  LeaveTypeInterface,
  LeaveRequestInterface,
} from "@/src/interface/LeaveInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  EMPLOYEE_LEAVE_REQUEST_CATEGORY,
  EMPLOYEE_LEAVE_REQUEST_SORT,
  EMPLOYEE_LEAVE_BALANCE_SEARCH,
  EMPLOYEE_LEAVE_BALANCE_SORT,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoPencil, IoTrash } from "react-icons/io5";

const Leave = () => {
  const [leaveBalances, setLeaveBalances] = React.useState<
    (LeaveBalanceInterface & LeaveTypeInterface & UserInterface)[]
  >([]);
  const [leaveRequests, setLeaveRequests] = React.useState<
    (LeaveTypeInterface & LeaveRequestInterface)[]
  >([]);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = React.useState(0);
  const [canEditLeaveRequest, setCanEditLeaveRequest] = React.useState(0);
  const [canDeleteLeaveRequest, setCanDeleteLeaveRequest] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("leaves");

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const sortFilter = {
    leaves: EMPLOYEE_LEAVE_BALANCE_SORT,
    requests: EMPLOYEE_LEAVE_REQUEST_SORT,
  };

  const categoryFilter = {
    requests: EMPLOYEE_LEAVE_REQUEST_CATEGORY,
  };

  const {
    search,
    debounceSearch,
    canSeeSearchDropDown,
    handleCanSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
  } = useSearch("type", "Leave Type");

  const {
    sort,
    canSeeSortDropDown,
    handleCanSeeSortDropDown,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("type", "Leave Type");

  const {
    category,
    canSeeCategoryDropDown,
    handleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("status", "All");

  const handleActiveTab = (tab: string) => {
    if (tab === activeTab) {
      return;
    }

    setActiveTab(tab);

    switch (tab) {
      case "balances":
        handleSelectSort("type", "Leave Type");
        break;
      case "requests":
        handleSelectSort("created_at", "Requested At");
        break;
    }
  };

  const getLeaveBalances = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/leave_balance`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
            params: { ...search, ...sort },
          }
        );

        if (responseData.leave_balances) {
          setLeaveBalances(responseData.leave_balances);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.token, url, search, sort]);

  const getLeaveRequests = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/leave_request`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
            params: { ...search, ...sort, ...category },
          }
        );

        if (responseData.requests) {
          setLeaveRequests(responseData.requests);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, search, sort, category]);

  const getPageData = React.useCallback(async () => {
    try {
      switch (activeTab) {
        case "leaves":
          getLeaveBalances();
          break;
        case "requests":
          getLeaveRequests();
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }, [activeTab, getLeaveBalances, getLeaveRequests]);

  const handleSelectedLeaveRequest = (leave_type_id: number) => {
    setSelectedLeaveRequest((prev) =>
      prev === leave_type_id ? 0 : leave_type_id
    );
  };

  const handleCanEditLeaveRequest = (id: number) => {
    setCanEditLeaveRequest((prev) => (prev === id ? 0 : id));
  };

  const handleCanDeleteLeaveRequest = (id: number) => {
    setCanDeleteLeaveRequest((prev) => (prev === id ? 0 : id));
  };

  const mappedLeaveBalances = leaveBalances.map((leave, index) => {
    return (
      <LeaveBalanceCard
        key={index}
        //
        type={leave.type}
        description={leave.description}
        balance={leave.balance}
        leave_balance_id={leave.leave_balance_id}
        //
        toggleSelectedLeaveRequest={() =>
          handleSelectedLeaveRequest(leave.leave_type_id ?? 0)
        }
      />
    );
  });

  const mappedLeaveRequests = leaveRequests.map((leave) => {
    const requestedAtDate = leave.requested_at
      ? new Date(leave.requested_at).toLocaleDateString()
      : "-";
    const requestAtTime = leave.requested_at
      ? new Date(leave.requested_at).toLocaleTimeString()
      : "-";

    const startDate = new Date(leave.start_date).toLocaleDateString();
    const startTime = new Date(leave.start_date).toLocaleTimeString();

    const endDate = new Date(leave.end_date).toLocaleDateString();
    const endTime = new Date(leave.end_date).toLocaleTimeString();

    return {
      type: leave.type,
      status: leave.status,
      start_date: `${startDate} ${startTime}`,
      end_date: `${endDate} ${endTime}`,
      requested_at: `${requestedAtDate} ${requestAtTime}`,
      reason: leave.reason,
      action: (
        <div className="w-full flex flex-row items-center justify-start gap-2 flex-wrap">
          <button
            onClick={() =>
              handleCanEditLeaveRequest(leave.leave_request_id ?? 0)
            }
            className="p-2 text-neutral-100 bg-accent-blue rounded-md transition-all"
          >
            <IoPencil />
          </button>
          <button
            onClick={() =>
              handleCanDeleteLeaveRequest(leave.leave_request_id ?? 0)
            }
            className="p-2 text-neutral-100 bg-red-600 rounded-md transition-all"
          >
            <IoTrash />
          </button>
        </div>
      ),
    };
  });

  React.useEffect(() => {
    getPageData();
  }, [getPageData]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {selectedLeaveRequest ? (
        <LeaveRequestForm
          id={selectedLeaveRequest}
          toggleModal={() => handleSelectedLeaveRequest(0)}
          refetchIndex={getLeaveBalances}
        />
      ) : null}

      {canEditLeaveRequest ? (
        <EditLeaveRequest
          toggleModal={() => handleCanEditLeaveRequest(0)}
          refetchIndex={getLeaveRequests}
          id={canEditLeaveRequest}
        />
      ) : null}

      {canDeleteLeaveRequest ? (
        <DeleteEntity
          route="leave_request"
          toggleModal={() => handleCanDeleteLeaveRequest(0)}
          refetchIndex={getLeaveRequests}
          id={canDeleteLeaveRequest}
          label="Leave Request"
        />
      ) : null}

      <div className="w-full h-auto flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2 t:p-4 gap-4 t:gap-8">
        <Tabs
          activeTab={activeTab}
          handleActiveTab={handleActiveTab}
          tabs={["balances", "requests"]}
        />

        <div className="w-full flex flex-col items-center justify-center gap-4 t:gap-8 ">
          <Filter
            useCategoryFilter={activeTab === "requests"}
            useSearchFilter={true}
            useSortFilter={true}
            //
            canSeeSearchDropDown={canSeeSearchDropDown}
            searchKey={debounceSearch.searchKey}
            searchLabel={debounceSearch.searchLabel}
            searchValue={debounceSearch.searchValue}
            searchKeyLabelPairs={EMPLOYEE_LEAVE_BALANCE_SEARCH}
            toggleCanSeeSearchDropDown={handleCanSeeSearchDropDown}
            selectSearch={handleSelectSearch}
            onChange={handleSearch}
            //
            isAsc={sort.isAsc}
            sortKey={sort.sortKey}
            sortLabel={sort.sortLabel}
            canSeeSortDropDown={canSeeSortDropDown}
            sortKeyLabelPairs={sortFilter[activeTab as keyof object]}
            selectSort={handleSelectSort}
            toggleAsc={handleToggleAsc}
            toggleCanSeeSortDropDown={handleCanSeeSortDropDown}
            //
            categoryValue={category.categoryValue}
            categoryKeyValuePairs={categoryFilter[activeTab as keyof object]}
            canSeeCategoryDropDown={canSeeCategoryDropDown}
            selectCategory={handleSelectCategory}
            toggleCanSeeCategoryDropDown={handleCanSeeCategoryDropDown}
          />

          {activeTab === "balances" ? (
            <div className="grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3 w-full h-auto">
              {mappedLeaveBalances}
            </div>
          ) : activeTab === "requests" ? (
            <div className="flex flex-col items-center justify-start w-full">
              <Table
                color="blue"
                headers={[
                  "Type",
                  "Status",
                  "Start Date",
                  "End Date",
                  "Requested At",
                  "Reason",
                  "Action",
                ]}
                contents={mappedLeaveRequests}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Leave;
