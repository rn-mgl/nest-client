"use client";

import PageTabs from "@/global/navigation/PageTabs";
import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Table from "@/src/components/global/field/Table";
import Filter from "@/src/components/global/filter/Filter";
import EditLeaveRequest from "@/src/components/global/leave/EditLeaveRequest";
import LeaveBalanceCard from "@/src/components/global/leave/LeaveBalanceCard";
import LeaveRequestForm from "@/src/components/global/leave/LeaveRequestForm";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import { useToasts } from "@/src/context/ToastContext";
import useCategory from "@/src/hooks/useCategory";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useIsLoading from "@/src/hooks/useIsLoading";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  LeaveBalanceInterface,
  LeaveRequestInterface,
} from "@/src/interface/LeaveInterface";
import {
  EMPLOYEE_LEAVE_BALANCE_SEARCH,
  EMPLOYEE_LEAVE_BALANCE_SORT,
  EMPLOYEE_LEAVE_REQUEST_CATEGORY,
  EMPLOYEE_LEAVE_REQUEST_SEARCH,
  EMPLOYEE_LEAVE_REQUEST_SORT,
} from "@/src/utils/filters";
import { normalizeDate, normalizeString } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoPencil, IoTrash } from "react-icons/io5";

const Leave = ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) => {
  const [leaveBalances, setLeaveBalances] = React.useState<
    LeaveBalanceInterface[]
  >([]);
  const [leaveRequests, setLeaveRequests] = React.useState<
    LeaveRequestInterface[]
  >([]);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = React.useState(0);
  const [canEditLeaveRequest, setCanEditLeaveRequest] = React.useState(0);
  const [canDeleteLeaveRequest, setCanDeleteLeaveRequest] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("balances");
  const { isLoading, handleIsLoading } = useIsLoading();

  const { addToast } = useToasts();

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const { tab } = React.use(searchParams);

  const searchFilter = {
    balances: EMPLOYEE_LEAVE_BALANCE_SEARCH,
    requests: EMPLOYEE_LEAVE_REQUEST_SEARCH,
  };

  const sortFilter = {
    balances: EMPLOYEE_LEAVE_BALANCE_SORT,
    requests: EMPLOYEE_LEAVE_REQUEST_SORT,
  };

  const categoryFilter = {
    requests: EMPLOYEE_LEAVE_REQUEST_CATEGORY,
  };

  const {
    search,
    canSeeSearchDropDown,
    handleCanSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
  } = useSearch("leave.type", "Leave Type");

  const {
    sort,
    canSeeSortDropDown,
    handleCanSeeSortDropDown,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("leave.type", "Leave Type");

  const {
    category,
    canSeeCategoryDropDown,
    toggleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("status", "All");

  const getLeaveBalances = React.useCallback(
    async (controller?: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token) {
          const { data: responseData } = await axios.get(
            `${url}/employee/leave_balance`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
              withCredentials: true,
              signal: controller?.signal,
            }
          );

          if (responseData.leave_balances) {
            setLeaveBalances(responseData.leave_balances);
          }
        }
      } catch (error) {
        console.log(error);

        if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the leave balances are being retrieved.";
          addToast("Leave Balance Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [user?.token, url, addToast, handleIsLoading]
  );

  const getLeaveRequests = React.useCallback(
    async (controller?: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token) {
          const { data: responseData } = await axios.get(
            `${url}/employee/leave_request`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
              withCredentials: true,
              signal: controller?.signal,
            }
          );

          if (responseData.requests) {
            setLeaveRequests(responseData.requests);
          }
        }
      } catch (error) {
        console.log(error);

        let message =
          "An error occurred when the leave requests are being retrieved.";

        if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
          message = error.response?.data.message ?? error.message;
        }

        addToast("Leave Request Error", message, "error");
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, addToast, handleIsLoading]
  );

  const getPageData = React.useCallback(
    async (tab: string, controller: AbortController) => {
      try {
        switch (tab) {
          case "balances":
            getLeaveBalances(controller);
            break;
          case "requests":
            getLeaveRequests(controller);
            break;
        }
      } catch (error) {
        console.log(error);
      }
    },
    [getLeaveBalances, getLeaveRequests]
  );

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

  const handleFilters = React.useCallback(
    (tab: string) => {
      switch (tab) {
        case "balances":
          handleSelectSearch("leave.type", "Leave Type");
          handleSelectSort("leave.type", "Leave Type");
          handleSelectCategory("", "");
          if (canSeeCategoryDropDown) {
            toggleCanSeeCategoryDropDown();
          }
          break;
        case "requests":
          handleSelectSearch("type", "Leave Type");
          handleSelectSort("type", "Leave Type");
          handleSelectCategory("status", "All");
          break;
      }
    },
    [
      canSeeCategoryDropDown,
      handleSelectSearch,
      handleSelectSort,
      handleSelectCategory,
      toggleCanSeeCategoryDropDown,
    ]
  );

  const mappedLeaveBalances = useFilterAndSort(
    leaveBalances,
    search,
    sort,
    category
  ).map((leave, index) => {
    return (
      <LeaveBalanceCard
        key={index}
        //
        assigned_to={leave.assigned_to}
        balance={leave.balance}
        created_at={leave.created_at}
        deleted_at={leave.deleted_at}
        leave={leave.leave}
        leave_type_id={leave.leave_type_id}
        provided_by={leave.provided_by}
        //
        toggleSelectedLeaveRequest={() =>
          handleSelectedLeaveRequest(leave.leave_type_id ?? 0)
        }
      />
    );
  });

  const leaveRequestRows = leaveRequests.map((leave) => {
    {
      const requestedAt = normalizeDate(leave.created_at);

      const start = normalizeDate(leave.start_date);

      const end = normalizeDate(leave.end_date);

      return {
        type: leave.leave.type,
        status: normalizeString(leave.status),
        start_date: start,
        end_date: end,
        requested_at: requestedAt,
        reason: leave.reason,
        action: (
          <div className="w-full flex flex-row items-center justify-start gap-2 flex-wrap">
            <button
              onClick={() => handleCanEditLeaveRequest(leave.id ?? 0)}
              className="p-2 text-neutral-100 bg-accent-blue rounded-md transition-all"
            >
              <IoPencil />
            </button>
            <button
              onClick={() => handleCanDeleteLeaveRequest(leave.id ?? 0)}
              className="p-2 text-neutral-100 bg-red-600 rounded-md transition-all"
            >
              <IoTrash />
            </button>
          </div>
        ),
      };
    }
  });

  const mappedLeaveRequests = useFilterAndSort(
    leaveRequestRows,
    search,
    sort,
    category
  );

  React.useEffect(() => {
    const controller = new AbortController();

    getPageData(activeTab, controller);

    return () => {
      controller.abort();
    };
  }, [getPageData, activeTab]);

  React.useEffect(() => {
    setActiveTab(tab ?? "balances");
  }, [setActiveTab, tab]);

  React.useEffect(() => {
    handleFilters(activeTab);
  }, [handleFilters, activeTab]);

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
        <PageTabs activeTab={activeTab} tabs={["balances", "requests"]} />

        <div className="w-full flex flex-col items-center justify-center gap-4 t:gap-8 ">
          <Filter
            //
            searchKeyLabelPairs={searchFilter[activeTab as keyof object]}
            search={{
              canSeeSearchDropDown: canSeeSearchDropDown,
              searchKey: search.searchKey,
              searchLabel: search.searchLabel,
              searchValue: search.searchValue,
              toggleCanSeeSearchDropDown: handleCanSeeSearchDropDown,
              selectSearch: handleSelectSearch,
              onChange: handleSearch,
            }}
            //
            sortKeyLabelPairs={sortFilter[activeTab as keyof object]}
            sort={{
              isAsc: sort.isAsc,
              sortKey: sort.sortKey,
              sortLabel: sort.sortLabel,
              canSeeSortDropDown: canSeeSortDropDown,
              selectSort: handleSelectSort,
              toggleAsc: handleToggleAsc,
              toggleCanSeeSortDropDown: handleCanSeeSortDropDown,
            }}
            //
            categoryKeyValuePairs={categoryFilter[activeTab as keyof object]}
            category={{
              categoryKey: category.categoryKey,
              categoryValue: category.categoryValue,
              canSeeCategoryDropDown: canSeeCategoryDropDown,
              selectCategory: handleSelectCategory,
              toggleCanSeeCategoryDropDown: toggleCanSeeCategoryDropDown,
            }}
          />

          {isLoading ? (
            <PageSkeletonLoader />
          ) : activeTab === "balances" ? (
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
