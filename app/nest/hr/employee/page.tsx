"use client";

import Table from "@/src/components/global/field/Table";
import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import Alert from "@/src/components/global/popup/Alert";
import Toasts from "@/src/components/global/popup/Toasts";
import Tabs from "@/src/components/global/Tabs";
import EmployeeCard from "@/src/components/hr/employee/EmployeeCard";
import ShowEmployee from "@/src/components/hr/employee/ShowEmployee";
import { useToasts } from "@/src/context/ToastContext";
import useCategory from "@/src/hooks/useCategory";
import useIsLoading from "@/src/hooks/useIsLoading";

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  LeaveBalanceInterface,
  LeaveTypeInterface,
  LeaveRequestInterface,
} from "@/src/interface/LeaveInterface";
import {
  EmployeeOnboardingInterface,
  OnboardingInterface,
} from "@/src/interface/OnboardingInterface";
import {
  EmployeePerformanceReviewInterface,
  PerformanceReviewInterface,
} from "@/src/interface/PerformanceReviewInterface";
import {
  EmployeeTrainingInterface,
  TrainingInterface,
} from "@/src/interface/TrainingInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  HR_EMPLOYEE_CATEGORY,
  HR_EMPLOYEE_LEAVE_CATEGORY,
  HR_EMPLOYEE_LEAVE_TYPE_SEARCH,
  HR_EMPLOYEE_LEAVE_TYPE_SORT,
  HR_EMPLOYEE_ONBOARDING_CATEGORY,
  HR_EMPLOYEE_ONBOARDING_SEARCH,
  HR_EMPLOYEE_ONBOARDING_SORT,
  HR_EMPLOYEE_PERFORMANCE_CATEGORY,
  HR_EMPLOYEE_PERFORMANCE_SEARCH,
  HR_EMPLOYEE_PERFORMANCE_SORT,
  HR_EMPLOYEE_SEARCH,
  HR_EMPLOYEE_SORT,
  HR_EMPLOYEE_TRAINING_CATEGORY,
  HR_EMPLOYEE_TRAINING_SEARCH,
  HR_EMPLOYEE_TRAINING_SORT,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios, { AxiosError } from "axios";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { IoCheckmark, IoClose, IoWarning } from "react-icons/io5";

const HREmployee = () => {
  const [employees, setEmployees] = React.useState<Array<UserInterface>>();
  const [onboardings, setOnboardings] = React.useState<
    (UserInterface & OnboardingInterface & EmployeeOnboardingInterface)[]
  >([]);
  const [leaves, setLeaves] = React.useState<
    (UserInterface &
      LeaveTypeInterface &
      LeaveBalanceInterface &
      LeaveRequestInterface)[]
  >([]);
  const [performances, setPerformances] = React.useState<
    (UserInterface &
      PerformanceReviewInterface &
      EmployeePerformanceReviewInterface)[]
  >([]);
  const [trainings, setTrainings] = React.useState<
    (TrainingInterface & EmployeeTrainingInterface & UserInterface)[]
  >([]);
  const [activeUserMenu, setActiveUserMenu] = React.useState(0);
  const [activeEmployeeSeeMore, setActiveEmployeeSeeMore] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("employees");
  const [respondToLeaveRequest, setRespondToLeaveRequest] = React.useState<{
    id: number;
    approved: boolean;
  }>({
    id: 0,
    approved: false,
  });

  const searchFilters = {
    employees: HR_EMPLOYEE_SEARCH,
    onboardings: HR_EMPLOYEE_ONBOARDING_SEARCH,
    leaves: HR_EMPLOYEE_LEAVE_TYPE_SEARCH,
    performances: HR_EMPLOYEE_PERFORMANCE_SEARCH,
    trainings: HR_EMPLOYEE_TRAINING_SEARCH,
  };

  const sortFilters = {
    employees: HR_EMPLOYEE_SORT,
    onboardings: HR_EMPLOYEE_ONBOARDING_SORT,
    leaves: HR_EMPLOYEE_LEAVE_TYPE_SORT,
    performances: HR_EMPLOYEE_PERFORMANCE_SORT,
    trainings: HR_EMPLOYEE_TRAINING_SORT,
  };

  const categoryFilters = {
    employees: HR_EMPLOYEE_CATEGORY,
    onboardings: HR_EMPLOYEE_ONBOARDING_CATEGORY,
    leaves: HR_EMPLOYEE_LEAVE_CATEGORY,
    performances: HR_EMPLOYEE_PERFORMANCE_CATEGORY,
    trainings: HR_EMPLOYEE_TRAINING_CATEGORY,
  };

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
  } = useCategory("verified", "All");

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleActiveEmployeeMenu = (id: number) => {
    return setActiveUserMenu((prev) => (prev === id ? 0 : id));
  };

  const handleActiveEmployeeSeeMore = (id: number) => {
    setActiveEmployeeSeeMore((prev) => (prev === id ? 0 : id));
  };

  const handleRespondToLeaveRequest = (id: number, approved: boolean) => {
    setRespondToLeaveRequest({ id, approved });
  };

  // set filters
  const handleActiveTab = (tab: string) => {
    if (tab === activeTab) return;

    setActiveTab(tab);

    switch (tab) {
      case "employees":
        handleSelectSort("first_name", "First Name");
        handleSelectCategory("verified", "All");
        break;
      case "onboardings":
        handleSelectSort("created_at", "Assigned On");
        handleSelectCategory("status", "All");
        break;
      case "leaves":
        handleSelectSort("start_date", "Start Date");
        handleSelectCategory("status", "All");
        break;
      case "performances":
        handleSelectSort("created_at", "Assigned On");
        handleSelectCategory("status", "All");
        break;
      case "trainings":
        handleSelectSort("deadline", "Deadline");
        handleSelectCategory("status", "All");
        break;
    }
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
          params: { ...search, ...sort, ...category, tab: "employees" },
        });

        if (responseData.employees) {
          setEmployees(responseData.employees);
        }
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
  }, [url, user?.token, search, sort, category, handleIsLoading, addToast]);

  const getEmployeeOnboardings = React.useCallback(async () => {
    try {
      handleIsLoading(true);
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(`${url}/hr/employee`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-CSRF-TOKEN": token,
          },
          params: { ...search, ...sort, ...category, tab: "onboardings" },
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
    } finally {
      handleIsLoading(false);
    }
  }, [url, user?.token, search, sort, category, addToast, handleIsLoading]);

  const getEmployeeLeaves = React.useCallback(async () => {
    try {
      handleIsLoading(true);
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(`${url}/hr/employee`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-CSRF-TOKEN": token,
          },
          params: { ...search, ...sort, ...category, tab: "leaves" },
          withCredentials: true,
        });

        if (responseData.leaves) {
          setLeaves(responseData.leaves);
        }
      }
    } catch (error) {
      console.log(error);

      let message = "An error occurred when getting the employee leaves";

      if (error instanceof AxiosError) {
        message = error.response?.data.message ?? error.message;
      }

      addToast("Something went wrong", message, "error");
    } finally {
      handleIsLoading(false);
    }
  }, [url, user?.token, search, sort, category, handleIsLoading, addToast]);

  const getEmployeePerformances = React.useCallback(async () => {
    try {
      handleIsLoading(true);

      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(`${url}/hr/employee`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-CSRF-TOKEN": token,
          },
          params: { ...search, ...sort, ...category, tab: "performances" },
          withCredentials: true,
        });

        if (responseData.performances) {
          setPerformances(responseData.performances);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleIsLoading(false);
    }
  }, [url, user?.token, search, sort, category, handleIsLoading]);

  const getEmployeeTrainings = React.useCallback(async () => {
    try {
      handleIsLoading(true);
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(`${url}/hr/employee`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-CSRF-TOKEN": token,
          },
          params: { ...search, ...sort, ...category, tab: "trainings" },
          withCredentials: true,
        });

        if (responseData.trainings) {
          setTrainings(responseData.trainings);
        }
      }
    } catch (error) {
      console.log(error);

      let message = "An error occurred when fetching the trainings.";

      if (error instanceof AxiosError) {
        message = error.response?.data.message ?? error.message;
      }

      addToast("Something went wrong", message, "error", 5000);
    } finally {
      handleIsLoading(false);
    }
  }, [url, user?.token, search, sort, category, handleIsLoading, addToast]);

  // main anchor of getting page data when the active tab changes
  const getPageData = React.useCallback(async () => {
    try {
      switch (activeTab) {
        case "employees":
          await getAllEmployees();
          break;
        case "onboardings":
          await getEmployeeOnboardings();
          break;
        case "leaves":
          await getEmployeeLeaves();
          break;
        case "performances":
          await getEmployeePerformances();
          break;
        case "trainings":
          await getEmployeeTrainings();
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    activeTab,
    getAllEmployees,
    getEmployeeOnboardings,
    getEmployeeLeaves,
    getEmployeePerformances,
    getEmployeeTrainings,
  ]);

  const handleLeaveRequestStatus = async (approved: boolean) => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.patch(
          `${url}/hr/employee_leave_request/${respondToLeaveRequest.id}`,
          { approved },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          handleRespondToLeaveRequest(0, false);
          await getEmployeeLeaves();
        }
      }
    } catch (error) {
      console.log(error);

      let message =
        "An error occurred when try to respond to the leave request";

      if (error instanceof AxiosError) {
        message = error.response?.data.message ?? error.message;
      }

      addToast("Something went wrong", message, "error");
    }
  };

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

  const mappedOnboardings = onboardings.map((onboarding) => {
    const assignedDate = onboarding.created_at
      ? new Date(onboarding.created_at).toLocaleDateString()
      : "-";
    const assignedTime = onboarding.created_at
      ? new Date(onboarding.created_at).toLocaleTimeString()
      : "-";

    const hasImage =
      typeof onboarding.image === "string" && onboarding.image !== "";

    return {
      image: (
        <div
          className={`flex flex-col items-center justify-center rounded-full overflow-clip relative max-w-10 aspect-square ${
            hasImage ? "bg-accent-blue/30" : "bg-accent-blue"
          }`}
        >
          {hasImage ? (
            <Image
              src={(onboarding.image as string) ?? ""}
              width={300}
              height={300}
              alt="profile"
              className="absolute"
            />
          ) : null}
        </div>
      ),
      first_name: onboarding.first_name,
      last_name: onboarding.last_name,
      email: onboarding.email,
      title: onboarding.title,
      status: onboarding.status,
      assigned_on: `${assignedDate} ${assignedTime}`,
    };
  });

  const mappedLeaves = leaves.map((leave) => {
    const {
      first_name,
      last_name,
      email,
      type,
      start_date,
      end_date,
      status,
      reason,
      balance,
    } = leave;

    const hasImage = typeof leave.image === "string" && leave.image !== "";
    const startDate = new Date(start_date).toLocaleDateString();
    const startTime = new Date(startDate).toLocaleTimeString();
    const endDate = new Date(end_date).toLocaleDateString();
    const endTime = new Date(end_date).toLocaleTimeString();

    return {
      image: (
        <div
          className={`flex flex-col items-center justify-center rounded-full overflow-clip relative max-w-10 aspect-square ${
            hasImage ? "bg-accent-blue/30" : "bg-accent-blue"
          }`}
        >
          {hasImage ? (
            <Image
              src={(leave.image as string) ?? ""}
              width={300}
              height={300}
              alt="profile"
              className="absolute"
            />
          ) : null}
        </div>
      ),
      first_name,
      last_name,
      email,
      type,
      start_date: `${startDate} ${startTime}`,
      end_date: `${endDate} ${endTime}`,
      status,
      reason,
      balance,
      action: (
        <div className="w-full flex flex-row flex-wrap items-center justify-start gap-2">
          <button
            onClick={() =>
              handleRespondToLeaveRequest(leave.leave_request_id ?? 0, true)
            }
            className="bg-accent-blue p-2 rounded-md text-accent-yellow font-bold w-full flex items-center justify-center l-l:w-fit"
          >
            <span className="flex items-center justify-center font-bold">
              <IoCheckmark />
            </span>
          </button>
          <button
            onClick={() =>
              handleRespondToLeaveRequest(leave.leave_request_id ?? 0, false)
            }
            className="bg-red-600 p-2 rounded-md text-neutral-100 font-bold w-full flex items-center justify-center l-l:w-fit"
          >
            <span className="flex items-center justify-center font-bold">
              <IoClose />
            </span>
          </button>
        </div>
      ),
    };
  });

  const mappedPerformances = performances.map((performance) => {
    const hasImage =
      typeof performance.image === "string" && performance.image !== "";

    const assignedDate = performance.created_at
      ? new Date(performance.created_at).toLocaleDateString()
      : "-";
    const assignedTime = performance.created_at
      ? new Date(performance.created_at).toLocaleTimeString()
      : "-";

    return {
      image: (
        <div
          className={`max-w-10 flex flex-col items-center justify-center relative aspect-square rounded-full overflow-clip 
                      ${hasImage ? "bg-accent-blue/30" : "bg-accent-blue"}`}
        >
          {hasImage ? (
            <Image
              src={(performance.image as string) ?? ""}
              alt="profile"
              width={300}
              height={300}
              className="absolute"
            />
          ) : null}
        </div>
      ),
      first_name: performance.first_name,
      last_name: performance.last_name,
      email: performance.email,
      title: performance.title,
      status: performance.status,
      assigned_on: `${assignedDate} ${assignedTime}`,
    };
  });

  const mappedTrainings = trainings.map((training) => {
    const hasImage =
      typeof training.image === "string" && training.image !== "";
    const deadlineDate = new Date(training.deadline).toLocaleDateString();
    const deadlineTime = new Date(training.deadline).toLocaleTimeString();
    const assignedDate = training.created_at
      ? new Date(training.created_at).toLocaleDateString()
      : "-";
    const assignedTime = training.created_at
      ? new Date(training.created_at).toLocaleTimeString()
      : "-";

    return {
      image: (
        <div
          className={`max-w-10 flex flex-col items-center justify-center relative aspect-square rounded-full overflow-clip 
                      ${hasImage ? "bg-accent-blue/30" : "bg-accent-blue"}`}
        >
          {hasImage ? (
            <Image
              src={(training.image as string) ?? ""}
              alt="profile"
              width={300}
              height={300}
              className="absolute"
            />
          ) : null}
        </div>
      ),
      first_name: training.first_name,
      last_name: training.last_name,
      email: training.email,
      title: training.title,
      deadline: `${deadlineDate} ${deadlineTime}`,
      status: training.status,
      score: training.score ?? "-",
      assigned_on: `${assignedDate} ${assignedTime}`,
    };
  });

  React.useEffect(() => {
    getPageData();
  }, [getPageData]);

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

      {respondToLeaveRequest.id ? (
        <Alert
          title={`${
            respondToLeaveRequest.approved ? "Approve" : "Reject"
          } Leave?`}
          body={`Are you sure you want to ${
            respondToLeaveRequest.approved ? "approve" : "reject"
          } this leave request?`}
          confirmAlert={() =>
            handleLeaveRequestStatus(respondToLeaveRequest.approved)
          }
          toggleAlert={() => handleRespondToLeaveRequest(0, false)}
          icon={<IoWarning />}
        />
      ) : null}

      <div className="gap-4 t:gap-8 w-full min-h-full h-auto flex flex-col items-start justify-start max-w-(--breakpoint-l-l) p-2 t:p-4">
        <Tabs
          activeTab={activeTab}
          handleActiveTab={handleActiveTab}
          tabs={[
            "employees",
            "onboardings",
            "leaves",
            "performances",
            "trainings",
          ]}
        />

        <div className="w-full flex flex-col items-center justify-start gap-4 t:gap-8">
          <Filter
            useSearchFilter={true}
            useSortFilter={true}
            useCategoryFilter={true}
            searchKey={debounceSearch.searchKey}
            searchLabel={debounceSearch.searchLabel}
            searchValue={debounceSearch.searchValue}
            searchKeyLabelPairs={searchFilters[activeTab as keyof object]}
            canSeeSearchDropDown={canSeeSearchDropDown}
            selectSearch={handleSelectSearch}
            toggleCanSeeSearchDropDown={handleCanSeeSearchDropDown}
            onChange={handleSearch}
            //
            categoryValue={category.categoryValue}
            canSeeCategoryDropDown={canSeeCategoryDropDown}
            categoryKeyValuePairs={categoryFilters[activeTab as keyof object]}
            toggleCanSeeCategoryDropDown={handleCanSeeCategoryDropDown}
            selectCategory={handleSelectCategory}
            //
            sortKey={sort.sortKey}
            sortLabel={sort.sortLabel}
            isAsc={sort.isAsc}
            canSeeSortDropDown={canSeeSortDropDown}
            sortKeyLabelPairs={sortFilters[activeTab as keyof object]}
            toggleAsc={handleToggleAsc}
            selectSort={handleSelectSort}
            toggleCanSeeSortDropDown={handleCanSeeSortDropDown}
          />

          {isLoading ? (
            <PageSkeletonLoader />
          ) : activeTab === "employees" ? (
            <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
              {mappedEmployees}
            </div>
          ) : activeTab === "onboardings" ? (
            <div className="w-full flex flex-col items-start justify-start overflow-x-auto">
              <Table
                headers={[
                  "Image",
                  "First Name",
                  "Last Name",
                  "Email",
                  "Title",
                  "Status",
                  "Assigned On",
                ]}
                contents={mappedOnboardings}
                color="blue"
              />
            </div>
          ) : activeTab === "leaves" ? (
            <div className="w-full flex flex-col items-center justify-start overflow-x-auto">
              <Table
                headers={[
                  "Image",
                  "First Name",
                  "Last Name",
                  "Email",
                  "Type",
                  "Start",
                  "End",
                  "Status",
                  "Reason",
                  "Balance",
                  "Action",
                ]}
                contents={mappedLeaves}
                color="blue"
              />
            </div>
          ) : activeTab === "performances" ? (
            <div className="w-full flex flex-col items-center justify-start overflow-x-auto">
              <Table
                headers={[
                  "Image",
                  "First Name",
                  "Last Name",
                  "Email",
                  "Title",
                  "Status",
                  "Assigned On",
                ]}
                contents={mappedPerformances}
                color="blue"
              />
            </div>
          ) : activeTab === "trainings" ? (
            <div className="w-full flex flex-col items-center justify-start overflow-x-auto">
              <Table
                headers={[
                  "Image",
                  "First Name",
                  "Last Name",
                  "Email",
                  "Title",
                  "Deadline",
                  "Status",
                  "Score",
                  "Assigned On",
                ]}
                contents={mappedTrainings}
                color="blue"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HREmployee;
