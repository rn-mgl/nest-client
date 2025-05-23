"use client";

import Filter from "@/src/components/global/filter/Filter";
import LeaveCard from "@/src/components/global/leave/LeaveCard";
import LeaveRequest from "@/src/components/global/leave/LeaveRequest";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  LeaveBalanceInterface,
  LeaveInterface,
} from "@/src/interface/LeaveInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
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
  const [selectedLeaveRequest, setSelectedLeaveRequest] = React.useState(0);

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

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

  const handleSelectedLeaveRequest = (leave_type_id: number) => {
    setSelectedLeaveRequest((prev) =>
      prev === leave_type_id ? 0 : leave_type_id
    );
  };

  const mappedLeaves = leaveBalances.map((leave, index) => {
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

  React.useEffect(() => {
    getLeaveBalances();
  }, [getLeaveBalances]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {selectedLeaveRequest ? (
        <LeaveRequest
          id={selectedLeaveRequest}
          toggleModal={() => handleSelectedLeaveRequest(0)}
          refetchIndex={getLeaveBalances}
        />
      ) : null}
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
                    t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          useCategoryFilter={false}
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
          sortKeyLabelPairs={EMPLOYEE_LEAVE_SORT}
          selectSort={handleSelectSort}
          toggleAsc={handleToggleAsc}
          toggleCanSeeSortDropDown={handleCanSeeSortDropDown}
        />
        <div className="grid grid-cols-1 gap-4 t:grid-cols-2 l-s:grid-cols-3">
          {mappedLeaves}
        </div>
      </div>
    </div>
  );
};

export default Leave;
