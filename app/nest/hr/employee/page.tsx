"use client";

import Tabs from "@/global/navigation/Tabs";
import BaseActions from "@/src/components/global/base/BaseActions";
import Table from "@/src/components/global/field/Table";
import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import EmployeeCard from "@/src/components/hr/employee/EmployeeCard";
import ShowEmployee from "@/src/components/hr/employee/ShowEmployee";
import { useAlert } from "@/src/context/AlertContext";
import { useToasts } from "@/src/context/ToastContext";
import useCategory from "@/src/hooks/useCategory";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useIsLoading from "@/src/hooks/useIsLoading";

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { LeaveRequestInterface } from "@/src/interface/LeaveInterface";
import { UserOnboardingInterface } from "@/src/interface/OnboardingInterface";
import { UserPerformanceReviewInterface } from "@/src/interface/PerformanceReviewInterface";
import { UserTrainingInterface } from "@/src/interface/TrainingInterface";
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
import {
  isCloudFileSummary,
  isLeaveBalanceSummary,
  isLeaveTypeSummary,
  isOnboardingSummary,
  isPerformanceReviewSummary,
  isTrainingSummary,
  isUserSummary,
  normalizeDate,
  normalizeString,
} from "@/src/utils/utils";
import axios, { AxiosError } from "axios";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { use } from "react";
import { IoCheckmark, IoClose } from "react-icons/io5";

const HREmployee = ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) => {
  const [employees, setEmployees] = React.useState<UserInterface[]>([]);
  const [onboardings, setOnboardings] = React.useState<
    UserOnboardingInterface[]
  >([]);
  const [leaves, setLeaves] = React.useState<LeaveRequestInterface[]>([]);
  const [performances, setPerformances] = React.useState<
    UserPerformanceReviewInterface[]
  >([]);
  const [trainings, setTrainings] = React.useState<UserTrainingInterface[]>([]);
  const [activeEmployeeSeeMore, setActiveEmployeeSeeMore] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("employees");

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

  const { addToast } = useToasts();

  const { showAlert } = useAlert();

  const {
    canSeeSearchDropDown,
    search,
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
  } = useCategory("verification_status", "All");

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const params = use(searchParams);
  const currentPath = usePathname();
  const tab = params.tab;

  const handleActiveEmployeeSeeMore = (id: number) => {
    setActiveEmployeeSeeMore((prev) => (prev === id ? 0 : id));
  };

  const sendMail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const getEmployeeData = React.useCallback(
    async (tab: string, controller?: AbortController) => {
      try {
        handleIsLoading(true);

        if (user?.token) {
          const { data: responseData } = await axios.get(`${url}/hr/user`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            signal: controller?.signal,
            params: { tab },
            withCredentials: true,
          });

          if (responseData[tab]) {
            switch (tab) {
              case "employees":
                setEmployees(responseData.employees);
                break;
              case "onboardings":
                setOnboardings(responseData.onboardings);
                break;
              case "leaves":
                setLeaves(responseData.leaves);
                break;
              case "performances":
                setPerformances(responseData.performances);
                break;
              case "trainings":
                setTrainings(responseData.trainings);
                break;
            }
          }
        }
      } catch (error) {
        console.log(error);

        let message = "An error occurred when fetching the trainings.";

        if (error instanceof AxiosError && error.code !== "ERR_CANCELED") {
          message = error.response?.data.message ?? error.message;
          addToast("Something went wrong", message, "error", 5000);
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, handleIsLoading, addToast]
  );

  const handleLeaveRequestStatus = async (
    leaveRequestId: number,
    approved: boolean
  ) => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.patch(
          `${url}/hr/user_leave_request/${leaveRequestId}`,
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
          await getEmployeeData("leaves");
        }
      }
    } catch (error) {
      console.log(error);

      const message =
        error instanceof AxiosError
          ? error.response?.data.message ?? error.message
          : "An error occurred";

      addToast("Something went wrong", message, "error");
    }
  };

  const mappedEmployees = useFilterAndSort(
    employees,
    search,
    sort,
    category
  ).map((employee, index) => {
    return (
      <EmployeeCard
        key={index}
        //
        user={{ ...employee }}
        sendMail={() => sendMail(employee.email)}
      >
        <BaseActions
          handleActiveSeeMore={() => handleActiveEmployeeSeeMore(employee.id)}
        />
      </EmployeeCard>
    );
  });

  const onboardingRows = onboardings.map((onboarding) => {
    const assignedOn = normalizeDate(onboarding.created_at);

    const assignedTo = isUserSummary(onboarding.assigned_to)
      ? onboarding.assigned_to
      : null;

    const assignedToImage =
      assignedTo && isCloudFileSummary(assignedTo.image)
        ? assignedTo.image.url
        : "";

    const onboardingDetails = isOnboardingSummary(onboarding.onboarding)
      ? onboarding.onboarding
      : null;

    return {
      image: (
        <div
          style={{ backgroundImage: `url(${assignedToImage})` }}
          className={`flex flex-col bg-center bg-cover items-center justify-center rounded-full overflow-clip relative max-w-10 aspect-square ${
            assignedToImage ? "bg-accent-blue/30" : "bg-accent-blue"
          }`}
        />
      ),
      first_name: assignedTo?.first_name ?? "-",
      last_name: assignedTo?.last_name ?? "-",
      email: assignedTo?.email ?? "-",
      title: onboardingDetails?.title ?? "-",
      status: normalizeString(onboarding.status),
      assigned_on: assignedOn,
    };
  });

  const mappedOnboardings = useFilterAndSort(
    onboardingRows,
    search,
    sort,
    category
  );

  const leaveRows = leaves.map((leave) => {
    const requestedBy = isUserSummary(leave.requested_by)
      ? leave.requested_by
      : null;

    const actionedBy = isUserSummary(leave.actioned_by)
      ? `${leave.actioned_by.first_name} ${leave.actioned_by.last_name}`
      : null;

    const leaveType = isLeaveTypeSummary(leave.leave) ? leave.leave : null;
    const leaveBalance = isLeaveBalanceSummary(leave.leave_balance)
      ? leave.leave_balance
      : null;

    const requestedByImage =
      requestedBy && isCloudFileSummary(requestedBy.image)
        ? requestedBy.image.url
        : "";
    const startOn = normalizeDate(leave.start_date);
    const endOn = normalizeDate(leave.end_date);

    return {
      image: (
        <div
          style={{ backgroundImage: `url(${requestedByImage})` }}
          className={`flex flex-col items-center justify-center rounded-full overflow-clip relative max-w-10 bg-center bg-cover aspect-square ${
            requestedByImage ? "bg-accent-blue/30" : "bg-accent-blue"
          }`}
        />
      ),
      first_name: requestedBy?.first_name ?? "-",
      last_name: requestedBy?.last_name ?? "-",
      email: requestedBy?.email ?? "-",
      type: leaveType?.type ?? "-",
      start_date: startOn,
      end_date: endOn,
      status: normalizeString(leave.status),
      reason: leave.reason,
      balance: leaveBalance?.balance ?? 0,
      action: actionedBy ?? (
        <div className="w-full flex flex-row flex-wrap items-center justify-start gap-2">
          <button
            onClick={() =>
              showAlert({
                title: "Approve Leave Request?",
                body: `Are you sure you want to approve the request from ${requestedBy?.first_name} ${requestedBy?.last_name}?`,
                confirmAlert: () =>
                  handleLeaveRequestStatus(leave.id ?? 0, true),
              })
            }
            className="bg-accent-blue p-2 rounded-md text-accent-yellow font-bold w-full flex items-center justify-center l-l:w-fit"
          >
            <span className="flex items-center justify-center font-bold">
              <IoCheckmark />
            </span>
          </button>
          <button
            onClick={() =>
              showAlert({
                title: "Reject Leave Request?",
                body: `Are you sure you want to reject the request from ${requestedBy?.first_name} ${requestedBy?.last_name}?`,
                confirmAlert: () =>
                  handleLeaveRequestStatus(leave.id ?? 0, false),
              })
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

  const mappedLeaves = useFilterAndSort(leaveRows, search, sort, category);

  const performanceRows = performances.map((performance) => {
    const assignedTo = isUserSummary(performance.assigned_to)
      ? performance.assigned_to
      : null;

    const assignedToImage =
      assignedTo && isCloudFileSummary(assignedTo.image)
        ? assignedTo.image.url
        : "";

    const assignedOn = normalizeDate(performance.created_at);

    const performanceReview = isPerformanceReviewSummary(
      performance.performance_review
    )
      ? performance.performance_review
      : null;

    return {
      image: (
        <div
          style={{ backgroundImage: `url(${assignedToImage})` }}
          className={`max-w-10 flex flex-col items-center justify-center relative aspect-square rounded-full overflow-clip bg-center bg-cover
                      ${
                        assignedToImage ? "bg-accent-blue/30" : "bg-accent-blue"
                      }`}
        />
      ),
      first_name: assignedTo?.first_name ?? "-",
      last_name: assignedTo?.last_name ?? "-",
      email: assignedTo?.email ?? "-",
      title: performanceReview ? performanceReview.title : "-",
      status: normalizeString(performance.status),
      assigned_on: assignedOn,
    };
  });

  const mappedPerformances = useFilterAndSort(
    performanceRows,
    search,
    sort,
    category
  );

  const trainingRows = trainings.map((training) => {
    const assignedTo = isUserSummary(training.assigned_to)
      ? training.assigned_to
      : null;

    const assignedToImage =
      assignedTo && isCloudFileSummary(assignedTo.image)
        ? assignedTo.image.url
        : "";

    const trainingDetails = isTrainingSummary(training.training)
      ? training.training
      : null;

    const deadline =
      typeof training.deadline === "string"
        ? normalizeDate(training.deadline)
        : "-";

    const assignedOn = normalizeDate(training.created_at);

    return {
      image: (
        <div
          style={{ backgroundImage: `url(${assignedToImage})` }}
          className={`max-w-10 flex flex-col items-center justify-center relative aspect-square rounded-full overflow-clip 
                      bg-center bg-cover
                      ${
                        assignedToImage ? "bg-accent-blue/30" : "bg-accent-blue"
                      }`}
        />
      ),
      first_name: assignedTo?.first_name ?? "-",
      last_name: assignedTo?.last_name ?? "-",
      email: assignedTo?.email ?? "-",
      title: trainingDetails?.title ?? "-",
      deadline: deadline,
      status: normalizeString(training.status),
      score: training.score ?? "-",
      assigned_on: assignedOn,
    };
  });

  const mappedTrainings = useFilterAndSort(
    trainingRows,
    search,
    sort,
    category
  );

  React.useEffect(() => {
    const controller = new AbortController();

    getEmployeeData(activeTab, controller);

    return () => {
      controller.abort();
    };
  }, [getEmployeeData, activeTab]);

  React.useEffect(() => {
    setActiveTab(tab ?? "employees");
  }, [setActiveTab, tab]);

  return (
    <div className="w-full min-h-full h-auto flex flex-col items-center justify-start">
      {activeEmployeeSeeMore ? (
        <ShowEmployee
          toggleModal={() => handleActiveEmployeeSeeMore(activeEmployeeSeeMore)}
          id={activeEmployeeSeeMore}
        />
      ) : null}

      <div className="gap-4 t:gap-8 w-full min-h-full h-auto flex flex-col items-start justify-start max-w-(--breakpoint-l-l) p-2 t:p-4">
        <Tabs
          activeTab={tab ?? "employees"}
          path={currentPath ?? ""}
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
            categoryKeyValuePairs={categoryFilters[activeTab as keyof object]}
            category={{
              categoryKey: category.categoryKey,
              categoryValue: category.categoryValue,
              canSeeCategoryDropDown: canSeeCategoryDropDown,
              toggleCanSeeCategoryDropDown: handleCanSeeCategoryDropDown,
              selectCategory: handleSelectCategory,
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
          />

          {isLoading ? (
            <PageSkeletonLoader />
          ) : activeTab === "employees" ? (
            <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
              {mappedEmployees}
            </div>
          ) : activeTab === "onboardings" ? (
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
          ) : activeTab === "leaves" ? (
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
          ) : activeTab === "performances" ? (
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
          ) : activeTab === "trainings" ? (
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
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HREmployee;
