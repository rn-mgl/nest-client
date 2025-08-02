"use client";

import Filter from "@/src/components/global/filter/Filter";
import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import AssignLeave from "@/src/components/hr/leave/AssignLeave";
import CreateLeave from "@/src/components/hr/leave/CreateLeave";
import EditLeave from "@/src/components/hr/leave/EditLeave";
import LeaveCard from "@/src/components/global/leave/LeaveCard";

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  LeaveBalanceInterface,
  LeaveInterface,
} from "@/src/interface/LeaveInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { HR_LEAVE_SEARCH, HR_LEAVE_SORT } from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

import Tabs from "@/src/components/global/Tabs";
import LeaveBalanceCard from "@/src/components/global/leave/LeaveBalanceCard";
import LeaveRequestForm from "@/src/components/global/leave/LeaveRequestForm";

const HRLeave = () => {
  const [canCreateLeave, setCanCreateLeave] = React.useState(false);
  const [canEditLeave, setCanEditLeave] = React.useState(false);
  const [canDeleteLeave, setCanDeleteLeave] = React.useState(false);
  const [canAssignLeave, setCanAssignLeave] = React.useState(false);
  const [activeLeaveMenu, setActiveLeaveMenu] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("types");
  const [selectedLeaveRequest, setSelectedLeaveRequest] = React.useState(0);
  const [leaveTypes, setLeaveTypes] = React.useState<
    Array<LeaveInterface & UserInterface>
  >([]);
  const [leaveBalances, setLeaveBalances] = React.useState<
    (LeaveInterface & LeaveBalanceInterface)[]
  >([]);

  const {
    search,
    canSeeSearchDropDown,
    debounceSearch,
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

  const handleActiveLeaveMenu = (id: number) => {
    setActiveLeaveMenu((prev) => (prev === id ? 0 : id));
  };

  const handleCanEditLeave = () => {
    setCanEditLeave((prev) => !prev);
  };

  const handleCanDeleteLeave = () => {
    setCanDeleteLeave((prev) => !prev);
  };

  const handleCanAssignLeave = () => {
    setCanAssignLeave((prev) => !prev);
  };

  const handleActiveTab = (tab: string) => {
    if (tab === activeTab) return;

    setActiveTab(tab);
  };

  const handleCanCreateLeave = () => {
    setCanCreateLeave((prev) => !prev);
  };

  const handleSelectedLeaveRequest = (id: number) => {
    setSelectedLeaveRequest((prev) => (prev === id ? 0 : id));
  };

  const getLeaveTypes = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(`${url}/hr/leave_type`, {
          headers: {
            "X-CSRF-TOKEN": token,
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
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/hr/leave_balance`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
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

  const getPageData = React.useCallback(async () => {
    switch (activeTab) {
      case "types":
        getLeaveTypes();
        break;
      case "leaves":
        getLeaveBalances();
        break;
    }
  }, [activeTab, getLeaveTypes, getLeaveBalances]);

  const mappedLeaves = leaveTypes.map((leave, index) => {
    const leaveId = leave.leave_type_id as number; // leave ids in this page have leaveids (from db)
    const activeMenu = activeLeaveMenu === leaveId;
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
        user_id={leave.user_id}
        //
        handleActiveMenu={() => handleActiveLeaveMenu(leaveId)}
        handleCanAssign={handleCanAssignLeave}
        handleCanDelete={handleCanDeleteLeave}
        handleCanEdit={handleCanEditLeave}
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

  React.useEffect(() => {
    getPageData();
  }, [getPageData]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateLeave ? (
        <CreateLeave
          toggleModal={handleCanCreateLeave}
          refetchIndex={getLeaveTypes}
        />
      ) : null}

      {canEditLeave ? (
        <EditLeave
          id={activeLeaveMenu}
          refetchIndex={getLeaveTypes}
          toggleModal={handleCanEditLeave}
        />
      ) : null}

      {canDeleteLeave ? (
        <DeleteEntity
          route="leave_type"
          label="Leave"
          id={activeLeaveMenu}
          refetchIndex={getLeaveTypes}
          toggleModal={handleCanDeleteLeave}
        />
      ) : null}

      {selectedLeaveRequest ? (
        <LeaveRequestForm
          toggleModal={() => handleSelectedLeaveRequest(0)}
          id={selectedLeaveRequest}
        />
      ) : null}

      {canAssignLeave ? (
        <AssignLeave id={activeLeaveMenu} toggleModal={handleCanAssignLeave} />
      ) : null}
      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Tabs
          activeTab={activeTab}
          handleActiveTab={handleActiveTab}
          tabs={["types", "leaves", "requests"]}
        />

        <Filter
          useSearchFilter={true}
          useSortFilter={true}
          useCategoryFilter={false}
          searchKey={debounceSearch.searchKey}
          searchLabel={debounceSearch.searchLabel}
          searchValue={debounceSearch.searchValue}
          searchKeyLabelPairs={HR_LEAVE_SEARCH}
          canSeeSearchDropDown={canSeeSearchDropDown}
          selectSearch={handleSelectSearch}
          toggleCanSeeSearchDropDown={handleCanSeeSearchDropDown}
          onChange={handleSearch}
          sortKey={sort.sortKey}
          sortLabel={sort.sortLabel}
          isAsc={sort.isAsc}
          canSeeSortDropDown={canSeeSortDropDown}
          sortKeyLabelPairs={HR_LEAVE_SORT}
          toggleAsc={handleToggleAsc}
          selectSort={handleSelectSort}
          toggleCanSeeSortDropDown={handleCanSeeSortDropDown}
        />

        {activeTab === "types" ? (
          <React.Fragment>
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
          </React.Fragment>
        ) : activeTab === "leaves" ? (
          <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
            {mappedLeaveBalances}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HRLeave;
