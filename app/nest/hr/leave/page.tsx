"use client";

import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Filter from "@/src/components/global/filter/Filter";
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
import {
  HR_LEAVE_BALANCE_SEARCH,
  HR_LEAVE_BALANCE_SORT,
  HR_LEAVE_REQUEST_CATEGORY,
  HR_LEAVE_REQUEST_SEARCH,
  HR_LEAVE_REQUEST_SORT,
  HR_LEAVE_TYPE_SEARCH,
  HR_LEAVE_TYPE_SORT,
} from "@/src/utils/filters";
import axios from "axios";

import { useSession } from "next-auth/react";
import React, { use } from "react";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";

import Tabs from "@/global/navigation/Tabs";
import BaseCard from "@/src/components/global/base/BaseCard";
import Table from "@/src/components/global/field/Table";
import EditLeaveRequest from "@/src/components/global/leave/EditLeaveRequest";
import LeaveBalanceCard from "@/src/components/global/leave/LeaveBalanceCard";
import LeaveRequestForm from "@/src/components/global/leave/LeaveRequestForm";
import HRActions from "@/src/components/hr/global/HRActions";
import useCategory from "@/src/hooks/useCategory";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import {
  isUserSummary,
  normalizeDate,
  normalizeString,
} from "@/src/utils/utils";
import { usePathname } from "next/navigation";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";

const HRLeave = ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) => {
  const [canCreateLeaveType, setCanCreateLeaveType] = React.useState(false);
  const [activeEditLeaveType, setActiveEditLeaveType] = React.useState(0);
  const [activeDeleteLeaveType, setActiveDeleteLeaveType] = React.useState(0);
  const [activeAssignLeaveType, setActiveAssignLeaveType] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("types");
  const [selectedLeaveRequest, setSelectedLeaveRequest] = React.useState(0);
  const [activeEditLeaveRequest, setActiveEditLeaveRequest] = React.useState(0);
  const [activeDeleteLeaveRequest, setActiveDeleteLeaveRequest] =
    React.useState(0);
  const [leaveTypes, setLeaveTypes] = React.useState<LeaveTypeInterface[]>([]);
  const [leaveBalances, setLeaveBalances] = React.useState<
    LeaveBalanceInterface[]
  >([]);
  const [leaveRequests, setLeaveRequest] = React.useState<
    LeaveRequestInterface[]
  >([]);
  const [isPending, startTransition] = React.useTransition();

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
  } = useCategory("", "");

  const searchFilters = {
    types: HR_LEAVE_TYPE_SEARCH,
    balances: HR_LEAVE_BALANCE_SEARCH,
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
  const params = use(searchParams);
  const tab = params.tab;

  const handleActiveEditLeaveType = (id: number) => {
    setActiveEditLeaveType((prev) => (id === prev ? 0 : id));
  };

  const handleActiveDeleteLeaveType = (id: number) => {
    setActiveDeleteLeaveType((prev) => (id === prev ? 0 : id));
  };

  const handleActiveAssignLeaveType = (id: number) => {
    setActiveAssignLeaveType((prev) => (id === prev ? 0 : id));
  };

  const handleActiveEditLeaveRequest = (id: number) => {
    setActiveEditLeaveRequest((prev) => (prev === id ? 0 : id));
  };

  const handleActiveDeleteLeaveRequest = (id: number) => {
    setActiveDeleteLeaveRequest((prev) => (prev === id ? 0 : id));
  };

  const handleCanCreateLeaveType = () => {
    setCanCreateLeaveType((prev) => !prev);
  };

  const handleSelectedLeaveRequest = (id: number) => {
    setSelectedLeaveRequest((prev) => (prev === id ? 0 : id));
  };

  const getLeaveTypes = React.useCallback(
    async (controller?: AbortController) => {
      startTransition(async () => {
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
        }
      });
    },
    [url, user?.token]
  );

  const getLeaveBalances = React.useCallback(
    async (controller?: AbortController) => {
      startTransition(async () => {
        try {
          if (user?.token) {
            const { data: responseData } = await axios.get(
              `${url}/hr/leave_balance`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
                withCredentials: true,
                signal: controller?.signal,
              }
            );

            if (responseData.balances) {
              setLeaveBalances(responseData.balances);
            }
          }
        } catch (error) {
          console.log(error);
        }
      });
    },
    [url, user?.token]
  );

  const getLeaveRequest = React.useCallback(
    async (controller?: AbortController) => {
      startTransition(async () => {
        try {
          if (user?.token) {
            const { data: responseData } = await axios.get(
              `${url}/hr/leave_request`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
                withCredentials: true,
                signal: controller?.signal,
              }
            );

            if (responseData.requests) {
              setLeaveRequest(responseData.requests);
            }
          }
        } catch (error) {
          console.log(error);
        }
      });
    },
    [url, user?.token]
  );

  const handleFilters = React.useCallback(
    (tab: string) => {
      switch (tab) {
        case "types":
          handleSelectSearch("type", "Leave Type");
          handleSelectSort("created_at", "Created At");
          handleSelectCategory("", "");
          break;
        case "balances":
          handleSelectSearch("leave.type", "Leave Type");
          handleSelectSort("created_at", "Created At");
          handleSelectCategory("", "");
          break;
        case "requests":
          handleSelectSearch("type", "Leave Type");
          handleSelectSort("requested_at", "Requested At");
          handleSelectCategory("status", "All");
          break;
      }
    },
    [handleSelectSearch, handleSelectSort, handleSelectCategory]
  );

  const getPageData = React.useCallback(
    async (tab: string, controller: AbortController) => {
      switch (tab) {
        case "types":
          await getLeaveTypes(controller);
          break;
        case "balances":
          await getLeaveBalances(controller);
          break;
        case "requests":
          await getLeaveRequest(controller);
          break;
      }
    },
    [getLeaveTypes, getLeaveBalances, getLeaveRequest]
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

  const mappedLeaveBalances = useFilterAndSort(leaveBalances, search, sort).map(
    (balance, index) => {
      return (
        <LeaveBalanceCard
          key={index}
          //
          leave_type_id={balance.leave_type_id}
          assigned_to={balance.assigned_to}
          created_at={balance.created_at}
          leave={balance.leave}
          provided_by={balance.provided_by}
          balance={balance.balance}
          deleted_at={balance.deleted_at}
          //
          toggleSelectedLeaveRequest={() =>
            handleSelectedLeaveRequest(balance.id ?? 0)
          }
        ></LeaveBalanceCard>
      );
    }
  );

  const leaveRequestRows = leaveRequests.map((request) => {
    const requestedOn = normalizeDate(request.created_at);
    const startDate = normalizeDate(request.start_date);
    const endDate = normalizeDate(request.end_date);

    return {
      type: request.leave.type,
      status: normalizeString(request.status),
      requested_at: requestedOn,
      start_date: startDate,
      end_date: endDate,
      reason: request.reason,
      action: (
        <div className="w-full flex flex-row items-center justify-start gap-2">
          <button
            onClick={() => handleActiveEditLeaveRequest(request.id ?? 0)}
            className="p-2 rounded-md bg-accent-blue text-neutral-100"
          >
            <IoPencil />
          </button>
          <button
            onClick={() => handleActiveDeleteLeaveRequest(request.id ?? 0)}
            className="p-2 rounded-md bg-red-600 text-neutral-100"
          >
            <IoTrash />
          </button>
        </div>
      ),
    };
  });

  const mappedLeaveRequests = useFilterAndSort(
    leaveRequestRows,
    search,
    sort,
    category
  );

  React.useEffect(() => {
    setActiveTab(tab ?? "types");
  }, [setActiveTab, tab]);

  React.useEffect(() => {
    const controller = new AbortController();

    getPageData(activeTab, controller);

    return () => {
      controller.abort();
    };
  }, [getPageData, activeTab]);

  React.useEffect(() => {
    handleFilters(activeTab);
  }, [activeTab, handleFilters]);

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

      {activeEditLeaveRequest ? (
        <EditLeaveRequest
          toggleModal={() =>
            handleActiveEditLeaveRequest(activeEditLeaveRequest)
          }
          id={activeEditLeaveRequest}
          refetchIndex={getLeaveRequest}
        />
      ) : null}

      {activeDeleteLeaveRequest ? (
        <DeleteEntity
          route="leave_request"
          toggleModal={() =>
            handleActiveDeleteLeaveRequest(activeDeleteLeaveRequest)
          }
          id={activeDeleteLeaveRequest}
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
            categoryKey: category.categoryKey,
            categoryValue: category.categoryValue,
            canSeeCategoryDropDown: canSeeCategoryDropDown,
            selectCategory: handleSelectCategory,
            toggleCanSeeCategoryDropDown: handleCanSeeCategoryDropDown,
          }}
        />

        {activeTab === "types" ? (
          <button
            onClick={handleCanCreateLeaveType}
            className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-40 transition-all"
          >
            Create Leave
            <IoAdd className="text-lg" />
          </button>
        ) : null}

        {isPending ? (
          <PageSkeletonLoader />
        ) : activeTab === "types" ? (
          <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
            {mappedLeaves}
          </div>
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
