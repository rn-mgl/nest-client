"use client";

import Filter from "@/src/components/global/Filter";
import useCategory from "@/src/hooks/useCategory";
import useFilters from "@/src/hooks/useFilters";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  HR_EMPLOYEE_CATEGORY,
  HR_EMPLOYEE_SEARCH,
  HR_EMPLOYEE_SORT,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { IoEllipsisVertical, IoMail, IoShieldCheckmark } from "react-icons/io5";

const HREmployee = () => {
  const [employees, setEmployees] = React.useState<Array<UserInterface>>();
  const [activeUserMenu, setActiveUserMenu] = React.useState(0);
  const { showFilters, handleShowFilters } = useFilters();
  const {
    search,
    canShowSearch,
    debounceSearch,
    handleSearch,
    handleCanShowSearch,
    handleSelectSearch,
  } = useSearch("first_name", "First Name");
  const {
    canShowSort,
    sort,
    handleCanShowSort,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("first_name", "First Name");
  const {
    canShowCategories,
    category,
    handleCanShowCategories,
    handleSelectCategory,
  } = useCategory("verified", "all", "All");

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleActiveEmployeeMenu = (id: number) => {
    return setActiveUserMenu((prev) => (prev === id ? 0 : id));
  };

  const sendMail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const getAllEmployees = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data } = await axios.get(`${url}/hr/employee`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
          },
          withCredentials: true,
          params: { ...search, ...sort, ...category },
        });

        setEmployees(data.employees);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, search, sort, category]);

  const mappedEmployees = employees?.map((employee) => {
    return (
      <div
        key={employee.user_id}
        className="w-full p-4 rounded-md bg-neutral-100 flex flex-row items-start justify-start gap-4 relative"
      >
        <div className="w-12 h-12 min-w-12 min-h-12 bg-linear-to-b from-accent-yellow to-accent-blue rounded-full"></div>
        <div className="flex flex-col items-start justify-center gap-1 w-full overflow-hidden">
          <p
            title={`${employee.first_name} ${employee.last_name} `}
            className="font-bold truncate w-full"
          >
            {employee.first_name} {employee.last_name}
          </p>
          <p className="text-xs flex flex-row items-center justify-center gap-1">
            {employee.email_verified_at ? (
              <IoShieldCheckmark
                className="text-accent-blue"
                title={`Verified at: ${employee.email_verified_at}`}
              />
            ) : null}
            {employee.email}
          </p>
        </div>
        <button
          onClick={() => handleActiveEmployeeMenu(employee.user_id)}
          className="p-2 text-xs hover:bg-neutral-200 rounded-full transition-all"
        >
          <IoEllipsisVertical
            className={`${
              activeUserMenu === employee.user_id
                ? "text-accent-blue"
                : "text-neutral-900"
            }`}
          />
        </button>

        {activeUserMenu === employee.user_id ? (
          <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
            <button
              onClick={() => sendMail(employee.email)}
              className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoMail className="text-accent-blue" />
              Mail
            </button>
          </div>
        ) : null}
      </div>
    );
  });

  React.useEffect(() => {
    getAllEmployees();
  }, [getAllEmployees]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
              t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          showSearch={true}
          showSort={true}
          showCategory={true}
          searchKey={debounceSearch.searchKey}
          searchLabel={debounceSearch.searchLabel}
          searchValue={debounceSearch.searchValue}
          searchKeyLabelPairs={HR_EMPLOYEE_SEARCH}
          canShowSearch={canShowSearch}
          selectSearch={handleSelectSearch}
          toggleShowSearch={handleCanShowSearch}
          onChange={handleSearch}
          showFilters={showFilters}
          toggleShowFilters={handleShowFilters}
          categoryLabel={category.categoryLabel}
          canShowCategories={canShowCategories}
          categoryKeyValuePairs={HR_EMPLOYEE_CATEGORY}
          toggleShowCategories={handleCanShowCategories}
          selectCategory={handleSelectCategory}
          sortKey={sort.sortKey}
          sortLabel={sort.sortLabel}
          isAsc={sort.isAsc}
          canShowSort={canShowSort}
          sortKeyLabelPairs={HR_EMPLOYEE_SORT}
          toggleAsc={handleToggleAsc}
          selectSort={handleSelectSort}
          toggleShowSort={handleCanShowSort}
        />
        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedEmployees}
        </div>
      </div>
    </div>
  );
};

export default HREmployee;
