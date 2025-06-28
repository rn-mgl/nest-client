"use client";

import Filter from "@/src/components/global/filter/Filter";
import Loading from "@/src/components/global/Loading";
import Toasts from "@/src/components/global/Toasts";
import EmployeeCard from "@/src/components/hr/employee/EmployeeCard";
import { useToasts } from "@/src/context/ToastContext";
import useCategory from "@/src/hooks/useCategory";
import useIsLoading from "@/src/hooks/useIsLoading";

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  HR_EMPLOYEE_CATEGORY,
  HR_EMPLOYEE_SEARCH,
  HR_EMPLOYEE_SORT,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios, { AxiosError } from "axios";

import { useSession } from "next-auth/react";
import React from "react";

const HREmployee = () => {
  const [employees, setEmployees] = React.useState<Array<UserInterface>>();
  const [activeUserMenu, setActiveUserMenu] = React.useState(0);

  const { isLoading, handleIsLoading } = useIsLoading(true);

  const { toasts, addToast, clearToast } = useToasts();

  const {
    search,
    canSeeSearchDropDown,
    debounceSearch,
    handleSearch,
    handleCanSeeSearchDropDown,
    handleSelectSearch,
  } = useSearch("first_name", "First Name");
  const {
    canSeeSortDropDown,
    sort,
    handleCanSeeSortDropDown,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("first_name", "First Name");
  const {
    canSeeCategoryDropDown,
    category,
    handleCanSeeCategoryDropDown,
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
      handleIsLoading(true);
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(`${url}/hr/employee`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "X-CSRF-TOKEN": token,
          },
          withCredentials: true,
          params: { ...search, ...sort, ...category },
        });

        if (responseData.employees) {
          setEmployees(responseData.employees);
        }

        handleIsLoading(false);
      }
    } catch (error) {
      let message = "An error occurred when getting the employees.";

      if (error instanceof AxiosError) {
        message = error?.response?.data.message ?? error.message;
      }

      handleIsLoading(false);

      addToast("Something went wrong", message, "error");
    }
  }, [url, user?.token, search, sort, category, handleIsLoading, addToast]);

  const mappedEmployees = employees?.map((employee, index) => {
    const activeMenu = activeUserMenu === employee.user_id;
    return (
      <EmployeeCard
        key={index}
        employee={employee}
        activeMenu={activeMenu}
        sendMail={() => sendMail(employee.email)}
        handleActiveMenu={() => handleActiveEmployeeMenu(employee.user_id)}
      />
    );
  });

  React.useEffect(() => {
    getAllEmployees();
  }, [getAllEmployees]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {toasts.length ? (
        <Toasts toasts={toasts} clearToast={clearToast} />
      ) : null}
      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
              t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          useSearchFilter={true}
          useSortFilter={true}
          useCategoryFilter={true}
          searchKey={debounceSearch.searchKey}
          searchLabel={debounceSearch.searchLabel}
          searchValue={debounceSearch.searchValue}
          searchKeyLabelPairs={HR_EMPLOYEE_SEARCH}
          canSeeSearchDropDown={canSeeSearchDropDown}
          selectSearch={handleSelectSearch}
          toggleCanSeeSearchDropDown={handleCanSeeSearchDropDown}
          onChange={handleSearch}
          categoryLabel={category.categoryLabel}
          canSeeCategoryDropDown={canSeeCategoryDropDown}
          categoryKeyValuePairs={HR_EMPLOYEE_CATEGORY}
          toggleCanSeeCategoryDropDown={handleCanSeeCategoryDropDown}
          selectCategory={handleSelectCategory}
          sortKey={sort.sortKey}
          sortLabel={sort.sortLabel}
          isAsc={sort.isAsc}
          canSeeSortDropDown={canSeeSortDropDown}
          sortKeyLabelPairs={HR_EMPLOYEE_SORT}
          toggleAsc={handleToggleAsc}
          selectSort={handleSelectSort}
          toggleCanSeeSortDropDown={handleCanSeeSortDropDown}
        />
        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedEmployees}
        </div>
      </div>
    </div>
  );
};

export default HREmployee;
