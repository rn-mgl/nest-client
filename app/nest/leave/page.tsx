"use client";

import PageTabs from "@/global/navigation/PageTabs";
import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Table from "@/src/components/global/field/Table";
import Filter from "@/src/components/global/filter/Filter";
import EditLeaveRequest from "@/src/components/leave/EditLeaveRequest";
import LeaveBalanceCard from "@/src/components/leave/LeaveBalanceCard";
import LeaveRequestForm from "@/src/components/leave/LeaveRequestForm";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import BaseCard from "@/src/components/global/resource/BaseCard";
import ResourceActions from "@/src/components/global/resource/ResourceActions";
import AssignLeaveType from "@/src/components/leave/AssignLeaveType";
import CreateLeaveType from "@/src/components/leave/CreateLeaveType";
import EditLeaveType from "@/src/components/leave/EditLeaveType";
import { useToasts } from "@/src/context/ToastContext";
import useCategory from "@/src/hooks/useCategory";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useIsLoading from "@/src/hooks/useIsLoading";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  LeaveBalanceInterface,
  LeaveRequestInterface,
  LeaveTypeInterface,
} from "@/src/interface/LeaveInterface";
import { LEAVE_ENDPOINT } from "@/src/configs/endpoint";
import {
  ASSIGNED_LEAVE_TYPE_SEARCH,
  ASSIGNED_LEAVE_TYPE_SORT,
  RESOURCE_LEAVE_REQUEST_CATEGORY,
  RESOURCE_LEAVE_REQUEST_SEARCH,
  RESOURCE_LEAVE_REQUEST_SORT,
  RESOURCE_LEAVE_TYPE_SEARCH,
  RESOURCE_LEAVE_TYPE_SORT,
} from "@/src/configs/filters";
import {
  isUserSummary,
  normalizeDate,
  normalizeString,
} from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5";

const Leave = ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) => {
  const [leaveTypes, setLeaveTypes] = React.useState<LeaveTypeInterface[]>([]);
  const [leaveBalances, setLeaveBalances] = React.useState<
    LeaveBalanceInterface[]
  >([]);
  const [leaveRequests, setLeaveRequests] = React.useState<
    LeaveRequestInterface[]
  >([]);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = React.useState(0);
  const [canCreateLeaveType, setCanCreateLeaveType] = React.useState(false);
  const [activeEditLeaveType, setActiveEditLeaveType] = React.useState(0);
  const [activeDeleteLeaveType, setActiveDeleteLeaveType] = React.useState(0);
  const [activeAssignLeaveType, setActiveAssignLeaveType] = React.useState(0);
  const [canEditLeaveRequest, setCanEditLeaveRequest] = React.useState(0);
  const [canDeleteLeaveRequest, setCanDeleteLeaveRequest] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("balance");

  const { isLoading, handleIsLoading } = useIsLoading();
  const { addToast } = useToasts();
  const { tab } = React.use(searchParams);

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  // permissions to check if a user can manage the record
  const canEditLeaveType = React.useMemo(() => {
    return user?.permissions.includes("update.leave_type_resource");
  }, [user?.permissions]);

  const canAssignLeaveType = React.useMemo(() => {
    return user?.permissions.includes("assign.leave_type_resource");
  }, [user?.permissions]);

  const canDeleteLeaveType = React.useMemo(() => {
    return user?.permissions.includes("delete.leave_type_resource");
  }, [user?.permissions]);

  const canManageLeaveType = React.useMemo(() => {
    return canEditLeaveType || canAssignLeaveType || canDeleteLeaveType;
  }, [canEditLeaveType, canAssignLeaveType, canDeleteLeaveType]);

  const searchFilter = {
    balance: ASSIGNED_LEAVE_TYPE_SEARCH,
    request: RESOURCE_LEAVE_REQUEST_SEARCH,
    resource: RESOURCE_LEAVE_TYPE_SEARCH,
  };

  const sortFilter = {
    balance: ASSIGNED_LEAVE_TYPE_SORT,
    request: RESOURCE_LEAVE_REQUEST_SORT,
    resource: RESOURCE_LEAVE_TYPE_SORT,
  };

  const categoryFilter = {
    request: RESOURCE_LEAVE_REQUEST_CATEGORY,
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
        case "balance":
          handleSelectSearch("leave.type", "Leave Type");
          handleSelectSort("leave.type", "Leave Type");
          handleSelectCategory("", "");

          break;
        case "request":
          handleSelectSearch("type", "Leave Type");
          handleSelectSort("type", "Leave Type");
          handleSelectCategory("status", "All");
          break;
        case "resource":
          handleSelectSearch("type", "Leave Type");
          handleSelectSort("type", "Leave Type");

          break;
      }
    },
    [handleSelectSearch, handleSelectSort, handleSelectCategory]
  );

  const getLeaves = React.useCallback(
    async (controller?: AbortController) => {
      try {
        handleIsLoading(true);

        const tabEndpoint =
          LEAVE_ENDPOINT[activeTab as keyof object] ?? LEAVE_ENDPOINT.balance;

        const hasPermission =
          !tabEndpoint.requiredPermission ||
          user?.permissions.includes(tabEndpoint.requiredPermission);

        const endpoint = hasPermission
          ? tabEndpoint.url
          : LEAVE_ENDPOINT.balance.url;

        if (user?.token) {
          const { data: responseData } = await axios.get(`${url}/${endpoint}`, {
            headers: { Authorization: `Bearer ${user.token}` },
            withCredentials: true,
            signal: controller?.signal,
          });

          if (responseData.leaves) {
            switch (activeTab) {
              case "balance":
                setLeaveBalances(responseData.leaves);
                break;
              case "request":
                setLeaveRequests(responseData.leaves);
                break;
              case "resource":
                setLeaveTypes(responseData.leaves);
                break;
              default:
                break;
            }
          }
        }
      } catch (error) {
        console.log(error);

        if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the leave types are being retrieved.";
          addToast("Leave Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.permissions, user?.token, activeTab, addToast, handleIsLoading]
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
          {canManageLeaveType ? (
            <ResourceActions
              handleActiveAssign={
                canAssignLeaveType
                  ? () => handleActiveAssignLeaveType(leaveId)
                  : null
              }
              handleActiveEdit={
                canEditLeaveType
                  ? () => handleActiveEditLeaveType(leaveId)
                  : null
              }
              handleActiveDelete={
                canDeleteLeaveType
                  ? () => handleActiveDeleteLeaveType(leaveId)
                  : null
              }
            />
          ) : null}
        </BaseCard>
      );
    }
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

    getLeaves(controller);

    return () => {
      controller.abort();
    };
  }, [getLeaves, activeTab]);

  React.useEffect(() => {
    if (!tab) {
      setActiveTab("balance");
      return;
    }

    const newTab = ["balance", "request", "resource"].includes(tab)
      ? tab
      : "balance";

    setActiveTab(newTab);
  }, [setActiveTab, tab]);

  React.useEffect(() => {
    handleFilters(activeTab);
  }, [handleFilters, activeTab]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateLeaveType &&
      user?.permissions.includes("create.leave_type_resource") ? (
        <CreateLeaveType
          toggleModal={handleCanCreateLeaveType}
          refetchIndex={getLeaves}
        />
      ) : null}

      {activeEditLeaveType &&
      user?.permissions.includes("update.leave_type_resource") ? (
        <EditLeaveType
          id={activeEditLeaveType}
          refetchIndex={getLeaves}
          toggleModal={() => handleActiveEditLeaveType(activeEditLeaveType)}
        />
      ) : null}

      {activeDeleteLeaveType &&
      user?.permissions.includes("delete.leave_type_resource") ? (
        <DeleteEntity
          route="leave-type/resource"
          label="Leave"
          id={activeDeleteLeaveType}
          refetchIndex={getLeaves}
          toggleModal={() => handleActiveDeleteLeaveType(activeDeleteLeaveType)}
        />
      ) : null}

      {activeAssignLeaveType &&
      user?.permissions.includes("assign.leave_type_resource") ? (
        <AssignLeaveType
          id={activeAssignLeaveType}
          toggleModal={() => handleActiveAssignLeaveType(activeAssignLeaveType)}
        />
      ) : null}

      {selectedLeaveRequest ? (
        <LeaveRequestForm
          id={selectedLeaveRequest}
          toggleModal={() => handleSelectedLeaveRequest(selectedLeaveRequest)}
          refetchIndex={getLeaves}
        />
      ) : null}

      {canEditLeaveRequest ? (
        <EditLeaveRequest
          toggleModal={() => handleCanEditLeaveRequest(canEditLeaveRequest)}
          refetchIndex={getLeaves}
          id={canEditLeaveRequest}
        />
      ) : null}

      {canDeleteLeaveRequest ? (
        <DeleteEntity
          route="leave-request/resource"
          toggleModal={() => handleCanDeleteLeaveRequest(canDeleteLeaveRequest)}
          refetchIndex={getLeaves}
          id={canDeleteLeaveRequest}
          label="Leave Request"
        />
      ) : null}

      <div className="w-full h-auto flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2 t:p-4 gap-4 t:gap-8">
        <PageTabs
          activeTab={activeTab}
          tabs={
            user?.permissions.includes("read.leave_type_resource")
              ? ["balance", "request", "resource"]
              : ["balance", "request"]
          }
        />

        <div className="w-full flex flex-col items-start justify-center gap-4 t:gap-8 ">
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

          {activeTab === "resource" &&
          user?.permissions.includes("create.leave_type_resource") ? (
            <button
              onClick={handleCanCreateLeaveType}
              className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-40 transition-all"
            >
              Create Leave
              <IoAdd className="text-lg" />
            </button>
          ) : null}

          {isLoading ? (
            <PageSkeletonLoader />
          ) : activeTab === "balance" ? (
            <div className="grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3 w-full h-auto">
              {mappedLeaveBalances}
            </div>
          ) : activeTab === "request" ? (
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
          ) : activeTab === "resource" &&
            user?.permissions.includes("read.leave_type_resource") ? (
            <div className="grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3 w-full h-auto">
              {mappedLeaves}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Leave;
