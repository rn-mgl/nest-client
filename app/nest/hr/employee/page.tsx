"use client";

import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import Toasts from "@/src/components/global/Toasts";
import EmployeeCard from "@/src/components/hr/employee/EmployeeCard";
import ShowEmployee from "@/src/components/hr/employee/ShowEmployee";
import { useToasts } from "@/src/context/ToastContext";
import useCategory from "@/src/hooks/useCategory";
import useIsLoading from "@/src/hooks/useIsLoading";

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  EmployeeOnboardingInterface,
  OnboardingInterface,
} from "@/src/interface/OnboardingInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  HR_EMPLOYEE_CATEGORY,
  HR_EMPLOYEE_ONBOARDING_CATEGORY,
  HR_EMPLOYEE_ONBOARDING_SEARCH,
  HR_EMPLOYEE_ONBOARDING_SORT,
  HR_EMPLOYEE_SEARCH,
  HR_EMPLOYEE_SORT,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios, { AxiosError } from "axios";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

const HREmployee = () => {
  const [employees, setEmployees] = React.useState<Array<UserInterface>>();
  const [onboardings, setOnboardings] = React.useState<
    (UserInterface & OnboardingInterface & EmployeeOnboardingInterface)[]
  >([]);
  const [activeUserMenu, setActiveUserMenu] = React.useState(0);
  const [activeEmployeeSeeMore, setActiveEmployeeSeeMore] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("employees");

  const searchFilters =
    activeTab === "employees"
      ? HR_EMPLOYEE_SEARCH
      : activeTab === "onboardings"
      ? HR_EMPLOYEE_ONBOARDING_SEARCH
      : [];

  const sortFilters =
    activeTab === "employees"
      ? HR_EMPLOYEE_SORT
      : activeTab === "onboardings"
      ? HR_EMPLOYEE_ONBOARDING_SORT
      : [];

  const categoryFilters =
    activeTab === "employees"
      ? HR_EMPLOYEE_CATEGORY
      : activeTab === "onboardings"
      ? HR_EMPLOYEE_ONBOARDING_CATEGORY
      : [];

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

  const tabs = [
    "employees",
    "onboardings",
    "leaves",
    "performances",
    "trainings",
  ];

  const handleActiveEmployeeMenu = (id: number) => {
    return setActiveUserMenu((prev) => (prev === id ? 0 : id));
  };

  const handleActiveEmployeeSeeMore = (id: number) => {
    setActiveEmployeeSeeMore((prev) => (prev === id ? 0 : id));
  };

  // set filters
  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);

    switch (tab) {
      case "employees":
        handleSelectSort("first_name", "First Name");
        handleSelectCategory("verified", "all", "All");
        break;
      case "onboardings":
        handleSelectSort("created_at", "Assigned On");
        handleSelectCategory("status", "all", "All");
        break;
    }
  };

  const sendMail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const getAllEmployees = React.useCallback(
    async (tab: string) => {
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
            params: { ...search, ...sort, ...category, tab },
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

        addToast("Something went wrong", message, "error");
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, search, sort, category, handleIsLoading, addToast]
  );

  const getEmployeeOnboardings = React.useCallback(
    async (tab: string) => {
      try {
        const { token } = await getCSRFToken();

        if (token && user?.token) {
          const { data: responseData } = await axios.get(`${url}/hr/employee`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            params: { ...search, ...sort, ...category, tab },
            withCredentials: true,
          });

          if (responseData.onboardings) {
            setOnboardings(responseData.onboardings);
          }
        }
      } catch (error) {
        console.log(error);

        let message = "An error occurred when getting the onboardings.";

        if (error instanceof AxiosError) {
          message = error.response?.data.message ?? error.message;
        }

        addToast("Something went wrong", message, "error");
      }
    },
    [url, user?.token, search, sort, category, addToast]
  );

  const getPageData = React.useCallback(async () => {
    try {
      switch (activeTab) {
        case "employees":
          await getAllEmployees(activeTab);
          break;
        case "onboardings":
          await getEmployeeOnboardings(activeTab);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }, [activeTab, getAllEmployees, getEmployeeOnboardings]);

  const mappedEmployees = employees?.map((employee, index) => {
    const activeMenu = activeUserMenu === employee.user_id;
    return (
      <EmployeeCard
        key={index}
        role={user?.role ?? ""}
        createdBy={false}
        //
        user_id={employee.user_id}
        first_name={employee.first_name}
        last_name={employee.last_name}
        email_verified_at={employee.email_verified_at}
        email={employee.email}
        image={employee.image}
        sendMail={() => sendMail(employee.email)}
        //
        activeMenu={activeMenu}
        handleActiveMenu={() => handleActiveEmployeeMenu(employee.user_id)}
        handleActiveSeeMore={() =>
          handleActiveEmployeeSeeMore(employee.user_id)
        }
      />
    );
  });

  const mappedOnboardings = onboardings.map((onboarding, index) => {
    const assignedDate = onboarding.created_at
      ? new Date(onboarding.created_at).toLocaleDateString()
      : "-";
    const assignedTime = onboarding.created_at
      ? new Date(onboarding.created_at).toLocaleTimeString()
      : "-";

    return (
      <div
        key={index}
        className="w-full p-4 border grid grid-cols-7 gap-4 min-w-(--breakpoint-t) last:rounded-b-md l-s:min-w-full"
      >
        <div
          className={`aspect-square w-full rounded-full max-w-10 relative 
                flex flex-col items-start justify-center overflow-clip ${
                  onboarding.image ? "bg-accent-purple/30" : "bg-accent-purple "
                }`}
        >
          {typeof onboarding.image === "string" && onboarding.image !== "" ? (
            <Image
              src={onboarding.image}
              alt="profile"
              width={300}
              height={300}
              className="absolute"
            />
          ) : null}
        </div>
        <div className="w-full flex flex-col items-start justify-center">
          <p className="truncate w-full">{onboarding.first_name}</p>
        </div>
        <div className="w-full flex flex-col items-start justify-center">
          <p className="truncate w-full">{onboarding.last_name}</p>
        </div>
        <div className="w-full flex flex-col items-start justify-center">
          <p className="truncate w-full">{onboarding.email}</p>
        </div>
        <div className="w-full flex flex-col items-start justify-center">
          <p className="truncate w-full">{onboarding.title}</p>
        </div>
        <div className="w-full flex flex-col items-start justify-center">
          <p className="truncate w-full">{onboarding.status}</p>
        </div>
        <div className="w-full flex flex-col items-start justify-center">
          <p className="truncate w-full">
            {assignedDate} {assignedTime}
          </p>
        </div>
      </div>
    );
  });

  const mappedTabs = tabs.map((tab, index) => {
    return (
      <button
        key={index}
        onClick={() => handleActiveTab(tab)}
        className={`w-full p-2 px-4 rounded-t-md text-sm transition-all capitalize ${
          activeTab === tab
            ? "text-accent-blue font-bold border-b-2 border-accent-blue"
            : "border-b-2"
        }`}
      >
        {tab}
      </button>
    );
  });

  React.useEffect(() => {
    getPageData();
  }, [getPageData]);

  if (isLoading) {
    return <PageSkeletonLoader />;
  }

  return (
    <div className="w-full min-h-full h-auto flex flex-col items-center justify-start">
      {toasts.length ? (
        <Toasts toasts={toasts} clearToast={clearToast} />
      ) : null}

      {activeEmployeeSeeMore ? (
        <ShowEmployee
          toggleModal={() => handleActiveEmployeeSeeMore(activeEmployeeSeeMore)}
          id={activeEmployeeSeeMore}
        />
      ) : null}

      <div
        className="w-full min-h-full h-auto flex flex-col items-start justify-start max-w-(--breakpoint-l-l) p-2
                  t:p-4"
      >
        <div className="w-full min-h-full h-auto flex flex-col items-start justify-start gap-4 t:gap-8">
          <div className="w-full">
            <div className="w-full flex flex-row overflow-x-auto">
              {mappedTabs}
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-start gap-4 t:gap-8">
            <Filter
              useSearchFilter={true}
              useSortFilter={true}
              useCategoryFilter={true}
              searchKey={debounceSearch.searchKey}
              searchLabel={debounceSearch.searchLabel}
              searchValue={debounceSearch.searchValue}
              searchKeyLabelPairs={searchFilters}
              canSeeSearchDropDown={canSeeSearchDropDown}
              selectSearch={handleSelectSearch}
              toggleCanSeeSearchDropDown={handleCanSeeSearchDropDown}
              onChange={handleSearch}
              //
              categoryLabel={category.categoryLabel}
              canSeeCategoryDropDown={canSeeCategoryDropDown}
              categoryKeyValuePairs={categoryFilters}
              toggleCanSeeCategoryDropDown={handleCanSeeCategoryDropDown}
              selectCategory={handleSelectCategory}
              //
              sortKey={sort.sortKey}
              sortLabel={sort.sortLabel}
              isAsc={sort.isAsc}
              canSeeSortDropDown={canSeeSortDropDown}
              sortKeyLabelPairs={sortFilters}
              toggleAsc={handleToggleAsc}
              selectSort={handleSelectSort}
              toggleCanSeeSortDropDown={handleCanSeeSortDropDown}
            />

            {activeTab === "employees" ? (
              <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
                {mappedEmployees}
              </div>
            ) : activeTab === "onboardings" ? (
              <div className="w-full flex flex-col items-start justify-start overflow-x-auto">
                <div className="w-full flex flex-col items-center justify-center min-w-(--breakpoint-t) l-s:min-w-full">
                  <div className="w-full grid grid-cols-7 bg-accent-blue p-4 gap-4 rounded-t-md items-start">
                    <div className="font-bold text-neutral-100">Image</div>
                    <div className="font-bold text-neutral-100">First Name</div>
                    <div className="font-bold text-neutral-100">Last Name</div>
                    <div className="font-bold text-neutral-100">Email</div>
                    <div className="font-bold text-neutral-100">Title</div>
                    <div className="font-bold text-neutral-100">Status</div>
                    <div className="font-bold text-neutral-100">
                      Assigned On
                    </div>
                  </div>
                  {mappedOnboardings}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HREmployee;
