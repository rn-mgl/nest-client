"use client";

import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Filter from "@/src/components/global/filter/Filter";
import EditLeaveRequest from "@/src/components/global/leave/EditLeaveRequest";
import LeaveCard from "@/src/components/global/leave/LeaveCard";
import LeaveRequestCard from "@/src/components/global/leave/LeaveRequestCard";
import LeaveRequestForm from "@/src/components/global/leave/LeaveRequestForm";
import useCategory from "@/src/hooks/useCategory";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  LeaveBalanceInterface,
  LeaveInterface,
  LeaveRequestInterface,
} from "@/src/interface/LeaveInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  EMPLOYEE_LEAVE_REQUEST_CATEGORY,
  EMPLOYEE_LEAVE_REQUEST_SORT,
  EMPLOYEE_LEAVE_SEARCH,
  EMPLOYEE_LEAVE_SORT,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Leave = () => {
  const [leaveBalances, setLeaveBalances] = React.useState<
    (LeaveBalanceInterface & LeaveInterface & UserInterface)[]
  >([]);
  const [leaveRequests, setLeaveRequests] = React.useState<
    (LeaveInterface & LeaveRequestInterface)[]
  >([]);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = React.useState(0);
  const [activeLeaveRequestMenu, setActiveLeaveRequestMenu] = React.useState(0);
  const [canEditLeaveRequest, setCanEditLeaveRequest] = React.useState(false);
  const [canDeleteLeaveRequest, setCanDeleteLeaveRequest] =
    React.useState(false);
  const [activeTab, setActiveTab] = React.useState("leaves");

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const tabs = ["leaves", "requests"];

  const sortFilter = {
    leaves: EMPLOYEE_LEAVE_SORT,
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
      case "leaves":
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

  const handleActiveLeaveRequestMenu = (id: number) => {
    setActiveLeaveRequestMenu((prev) => (prev === id ? 0 : id));
  };

  const handleCanEditLeaveRequest = () => {
    setCanEditLeaveRequest((prev) => !prev);
  };

  const handleCanDeleteLeaveRequest = () => {
    setCanDeleteLeaveRequest((prev) => !prev);
  };

  const mappedLeaveBalances = leaveBalances.map((leave, index) => {
    return (
      <LeaveCard
        key={index}
        role={user?.role ?? "employee"}
        createdBy={false}
        //
        type={leave.type}
        description={leave.description}
        balance={leave.balance}
        leave_balance_id={leave.leave_balance_id}
        //
        first_name={leave.first_name}
        last_name={leave.last_name}
        email={leave.email}
        email_verified_at={leave.email_verified_at}
        user_id={leave.user_id}
        //
        toggleSelectedLeaveRequest={() =>
          handleSelectedLeaveRequest(leave.leave_type_id ?? 0)
        }
      />
    );
  });

  const mappedLeaveRequests = leaveRequests.map((leave, index) => {
    const createdBy = leave.user_id === user?.current;
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

    return (
      <LeaveRequestCard
        key={index}
        createdBy={createdBy}
        //
        description={leave.description}
        approved_by={leave.approved_by}
        start_date={`${startDate} ${startTime}`}
        end_date={`${endDate} ${endTime}`}
        reason={leave.reason}
        status={leave.status}
        role={user?.role ?? ""}
        type={leave.type}
        user_id={leave.user_id}
        requested_at={`${requestedAtDate} ${requestAtTime}`}
        //
        activeMenu={activeLeaveRequestMenu === leave.leave_request_id}
        handleActiveMenu={() =>
          handleActiveLeaveRequestMenu(leave.leave_request_id ?? 0)
        }
        handleCanEdit={handleCanEditLeaveRequest}
        handleCanDelete={handleCanDeleteLeaveRequest}
      />
    );
  });

  const mappedTabs = tabs.map((tab, index) => {
    return (
      <button
        key={index}
        onClick={() => handleActiveTab(tab)}
        className={`capitalize w-full border-b-2 p-2 transition-all ${
          tab === activeTab
            ? "text-accent-blue border-accent-blue font-bold"
            : ""
        }`}
      >
        {tab}
      </button>
    );
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
          toggleModal={handleCanEditLeaveRequest}
          refetchIndex={getLeaveRequests}
          id={activeLeaveRequestMenu}
        />
      ) : null}

      {canDeleteLeaveRequest ? (
        <DeleteEntity
          route="leave_request"
          toggleModal={handleCanDeleteLeaveRequest}
          refetchIndex={getLeaveRequests}
          id={activeLeaveRequestMenu}
          label="Leave Request"
        />
      ) : null}

      <div className="w-full h-auto flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2 t:p-4 gap-4 t:gap-8">
        <div className="flex flex-row items-center justify-between w-full">
          {mappedTabs}
        </div>

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
            searchKeyLabelPairs={EMPLOYEE_LEAVE_SEARCH}
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

          {activeTab === "leaves" ? (
            <div className="grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3 w-full h-auto">
              {mappedLeaveBalances}
            </div>
          ) : activeTab === "requests" ? (
            <div className="grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3 gap-4 w-full h-auto">
              {mappedLeaveRequests}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Leave;
