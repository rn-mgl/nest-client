"use client";

import PageTabs from "@/global/navigation/PageTabs";
import Input from "@/src/components/global/form/Input";
import Table from "@/src/components/global/field/Table";
import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import BaseActions from "@/src/components/global/resource/BaseActions";
import ShowUser from "@/src/components/management/ShowUser";
import UserCard from "@/src/components/management/UserCard";
import {
  MANAGEMENT_ATTENDANCE_SEARCH,
  MANAGEMENT_ATTENDANCE_SORT,
  MANAGEMENT_CATEGORY,
  MANAGEMENT_LEAVE_CATEGORY,
  MANAGEMENT_LEAVE_TYPE_SEARCH,
  MANAGEMENT_LEAVE_TYPE_SORT,
  MANAGEMENT_ONBOARDING_CATEGORY,
  MANAGEMENT_ONBOARDING_SEARCH,
  MANAGEMENT_ONBOARDING_SORT,
  MANAGEMENT_PERFORMANCE_CATEGORY,
  MANAGEMENT_PERFORMANCE_SEARCH,
  MANAGEMENT_PERFORMANCE_SORT,
  MANAGEMENT_SEARCH,
  MANAGEMENT_SORT,
  MANAGEMENT_TRAINING_CATEGORY,
  MANAGEMENT_TRAINING_SEARCH,
  MANAGEMENT_TRAINING_SORT,
} from "@/src/configs/filters";
import { useAlert } from "@/src/context/AlertContext";
import { useToasts } from "@/src/context/ToastContext";
import useCategory from "@/src/hooks/useCategory";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useIsLoading from "@/src/hooks/useIsLoading";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { AttendanceInterface } from "@/src/interface/AttendanceInterface";
import { LeaveRequestInterface } from "@/src/interface/LeaveInterface";
import { UserOnboardingInterface } from "@/src/interface/OnboardingInterface";
import { UserPerformanceReviewInterface } from "@/src/interface/PerformanceReviewInterface";
import { UserTrainingInterface } from "@/src/interface/TrainingInterface";
import { UserInterface } from "@/src/interface/UserInterface";
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
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoCheckmark, IoClose, IoPencil } from "react-icons/io5";
import ShowAssignedOnboarding from "@/src/components/onboarding/ShowAssignedOnboarding";
import ShowAssignedPerformanceReview from "@/src/components/performance/ShowAssignedPerformanceReview";
import ShowAssignedTraining from "@/src/components/training/ShowAssignedTraining";

const Management = ({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) => {
  const [users, setUsers] = React.useState<UserInterface[]>([]);
  const [attendances, setAttedances] = React.useState<
    (UserInterface & { attendance: AttendanceInterface })[]
  >([]);
  const [onboardings, setOnboardings] = React.useState<
    UserOnboardingInterface[]
  >([]);
  const [leaves, setLeaves] = React.useState<LeaveRequestInterface[]>([]);
  const [performances, setPerformances] = React.useState<
    UserPerformanceReviewInterface[]
  >([]);
  const [trainings, setTrainings] = React.useState<UserTrainingInterface[]>([]);
  const [activeUserSeeMore, setActiveUserSeeMore] = React.useState(0);
  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeTab, setActiveTab] = React.useState("users");
  const [activeEditOnboarding, setActiveEditOnboarding] = React.useState(0);
  const [activeEditPerformance, setActiveEditPerformance] = React.useState(0);
  const [activeEditTraining, setActiveEditTraining] = React.useState(0);

  const { isLoading, handleIsLoading } = useIsLoading();

  const searchFilters = {
    users: MANAGEMENT_SEARCH,
    attendances: MANAGEMENT_ATTENDANCE_SEARCH,
    onboardings: MANAGEMENT_ONBOARDING_SEARCH,
    leaves: MANAGEMENT_LEAVE_TYPE_SEARCH,
    performances: MANAGEMENT_PERFORMANCE_SEARCH,
    trainings: MANAGEMENT_TRAINING_SEARCH,
  };

  const sortFilters = {
    users: MANAGEMENT_SORT,
    attendances: MANAGEMENT_ATTENDANCE_SORT,
    onboardings: MANAGEMENT_ONBOARDING_SORT,
    leaves: MANAGEMENT_LEAVE_TYPE_SORT,
    performances: MANAGEMENT_PERFORMANCE_SORT,
    trainings: MANAGEMENT_TRAINING_SORT,
  };

  const categoryFilters = {
    users: MANAGEMENT_CATEGORY,
    onboardings: MANAGEMENT_ONBOARDING_CATEGORY,
    leaves: MANAGEMENT_LEAVE_CATEGORY,
    performances: MANAGEMENT_PERFORMANCE_CATEGORY,
    trainings: MANAGEMENT_TRAINING_CATEGORY,
  };

  const { addToast } = useToasts();

  const { showAlert } = useAlert();

  const {
    canSeeSearchDropDown,
    search,
    handleSearch,
    toggleCanSeeSearchDropDown,
    handleSelectSearch,
  } = useSearch("first_name", "First Name");

  const {
    canSeeSortDropDown,
    sort,
    toggleCanSeeSortDropDown,
    handleSelectSort,
    toggleAsc,
  } = useSort("first_name", "First Name");

  const {
    canSeeCategoryDropDown,
    category,
    toggleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("verification_status", "All");

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const params = React.use(searchParams);
  const tab = params.tab;

  const handleActiveUserSeeMore = (id: number) => {
    setActiveUserSeeMore((prev) => (prev === id ? 0 : id));
  };

  const sendMail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setDate(value);
  };

  const handleActiveEditOnboarding = (id: number) => {
    setActiveEditOnboarding((prev) => (prev === id ? 0 : id));
  };

  const handleActiveEditPerformance = (id: number) => {
    setActiveEditPerformance((prev) => (prev === id ? 0 : id));
  };

  const handleActiveEditTraining = (id: number) => {
    setActiveEditTraining((prev) => (prev === id ? 0 : id));
  };

  const getUserData = React.useCallback(
    async (tab: string, controller?: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token && user.permissions.includes("read.management")) {
          const { data: responseData } = await axios.get(`${url}/management`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            signal: controller?.signal,
            params: { tab, date },
            withCredentials: true,
          });

          if (responseData[tab]) {
            switch (tab) {
              case "users":
                setUsers(responseData.users);
                break;
              case "attendances":
                setAttedances(responseData.attendances);
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

        if (isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            `An error occurred when the ${tab} data are being retrieved`;
          addToast("Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, user?.permissions, date, addToast, handleIsLoading]
  );

  const handleLeaveRequestStatus = async (
    leaveRequestId: number,
    approved: boolean
  ) => {
    try {
      handleIsLoading(true);
      const { token } = await getCSRFToken();

      if (
        token &&
        user?.token &&
        user.permissions.includes("update.leave_request_resource")
      ) {
        const { data: responseData } = await axios.patch(
          `${url}/leave-request/assigned/${leaveRequestId}`,
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
          await getUserData("leaves");
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error) && error.code !== "ERR_CANCELED") {
        const message =
          error.response?.data.message ??
          error.message ??
          `An error occurred when the leave request is being handled.`;
        addToast("Leave Error", message, "error");
      }
    } finally {
      handleIsLoading(false);
    }
  };

  const mappedUsers = useFilterAndSort(users, search, sort, category).map(
    (user) => {
      return (
        <UserCard
          key={user.id}
          //
          user={{ ...user }}
          sendMail={() => sendMail(user.email)}
        >
          <BaseActions
            handleActiveSeeMore={() => handleActiveUserSeeMore(user.id)}
          />
        </UserCard>
      );
    }
  );

  const attendanceRows = attendances.map((userAttendance) => {
    const userImage = isCloudFileSummary(userAttendance.image)
      ? userAttendance.image.url
      : "";

    const login =
      typeof userAttendance.attendance.login_time === "string"
        ? normalizeDate(userAttendance.attendance.login_time)
        : "-";

    const logout =
      typeof userAttendance.attendance.logout_time === "string"
        ? normalizeDate(userAttendance.attendance.logout_time)
        : "-";

    const late =
      userAttendance.attendance.late === null
        ? "-"
        : userAttendance.attendance.late
        ? "Yes"
        : "No";

    const absent = userAttendance.attendance.absent ? "Yes" : "No";

    return {
      image: (
        <div
          style={{ backgroundImage: `url(${userImage})` }}
          className={`flex flex-col bg-center bg-cover items-center justify-center rounded-full overflow-clip relative max-w-10 aspect-square ${
            userImage ? "bg-accent-blue/30" : "bg-accent-blue"
          }`}
        />
      ),
      first_name: userAttendance.first_name,
      last_name: userAttendance.last_name,
      email: userAttendance.email,
      login_time: login,
      logout_time: logout,
      late: late,
      absent: absent,
    };
  });

  const mappedAttendances = useFilterAndSort(
    attendanceRows,
    search,
    sort,
    category
  );

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
      status: normalizeString(
        typeof onboarding.status === "string" ? onboarding.status : ""
      ),
      assigned_on: assignedOn,
      action: (
        <div className="w-full flex flex-col items-start justify-center">
          <button
            onClick={() => handleActiveEditOnboarding(onboarding.id ?? 0)}
            title="Edit"
            type="button"
            className="p-2 rounded-md bg-accent-yellow text-accent-blue"
          >
            <IoPencil />
          </button>
        </div>
      ),
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
      action: user?.permissions.includes("update.leave_request_resource") ? (
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
      ) : null,
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
      status: normalizeString(
        typeof performance.status === "string" ? performance.status : ""
      ),
      assigned_on: assignedOn,
      action: (
        <div className="w-full flex flex-col items-start justify-center">
          <button
            onClick={() => handleActiveEditPerformance(performance.id ?? 0)}
            title="Edit"
            type="button"
            className="p-2 rounded-md bg-accent-yellow text-accent-blue"
          >
            <IoPencil />
          </button>
        </div>
      ),
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
      status: normalizeString(
        typeof training.status === "string" ? training.status : ""
      ),
      score: training.score ?? "-",
      assigned_on: assignedOn,
      action: (
        <div className="w-full flex flex-col items-start justify-center">
          <button
            onClick={() => handleActiveEditTraining(training.id ?? 0)}
            title="Edit"
            type="button"
            className="p-2 rounded-md bg-accent-yellow text-accent-blue"
          >
            <IoPencil />
          </button>
        </div>
      ),
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

    getUserData(activeTab, controller);

    return () => {
      controller.abort();
    };
  }, [getUserData, activeTab]);

  React.useEffect(() => {
    setActiveTab(tab ?? "users");
  }, [setActiveTab, tab]);

  return user?.permissions.includes("read.management") ? (
    <div className="w-full min-h-full h-auto flex flex-col items-center justify-start">
      {activeUserSeeMore ? (
        <ShowUser
          toggleModal={() => handleActiveUserSeeMore(activeUserSeeMore)}
          id={activeUserSeeMore}
        />
      ) : null}

      {activeEditOnboarding ? (
        <ShowAssignedOnboarding
          toggleModal={() => handleActiveEditOnboarding(activeEditOnboarding)}
          id={activeEditOnboarding}
          refetchIndex={() => getUserData(activeTab)}
          viewSource="assigner"
        />
      ) : null}

      {activeEditPerformance ? (
        <ShowAssignedPerformanceReview
          toggleModal={() => handleActiveEditPerformance(activeEditPerformance)}
          id={activeEditPerformance}
          refetchIndex={() => getUserData(activeTab)}
          viewSource="assigner"
        />
      ) : null}

      {activeEditTraining ? (
        <ShowAssignedTraining
          toggleModal={() => handleActiveEditTraining(activeEditTraining)}
          id={activeEditTraining}
          refetchIndex={() => getUserData(activeTab)}
          viewSource="assigner"
        />
      ) : null}

      <div className="gap-4 t:gap-8 w-full min-h-full h-auto flex flex-col items-start justify-start max-w-(--breakpoint-l-l) p-2 t:p-4">
        <PageTabs
          activeTab={tab ?? "users"}
          tabs={[
            "users",
            "attendances",
            "onboardings",
            "leaves",
            "performances",
            "trainings",
          ]}
        />

        <div className="w-full flex flex-col items-start justify-start gap-4 t:gap-8">
          <div className="w-full flex flex-col items-start justify-start t:flex-row t:items-center t:justify-center t:gap-2">
            <Filter
              searchKeyLabelPairs={searchFilters[activeTab as keyof object]}
              search={{
                searchKey: search.searchKey,
                searchLabel: search.searchLabel,
                searchValue: search.searchValue,
                canSeeSearchDropDown: canSeeSearchDropDown,
                selectSearch: handleSelectSearch,
                toggleCanSeeSearchDropDown: toggleCanSeeSearchDropDown,
                onChange: handleSearch,
              }}
              //
              categoryKeyValuePairs={categoryFilters[activeTab as keyof object]}
              category={{
                categoryKey: category.categoryKey,
                categoryValue: category.categoryValue,
                canSeeCategoryDropDown: canSeeCategoryDropDown,
                toggleCanSeeCategoryDropDown: toggleCanSeeCategoryDropDown,
                selectCategory: handleSelectCategory,
              }}
              //
              sortKeyLabelPairs={sortFilters[activeTab as keyof object]}
              sort={{
                sortKey: sort.sortKey,
                sortLabel: sort.sortLabel,
                isAsc: sort.isAsc,
                canSeeSortDropDown: canSeeSortDropDown,
                toggleAsc: toggleAsc,
                selectSort: handleSelectSort,
                toggleCanSeeSortDropDown: toggleCanSeeSortDropDown,
              }}
            />

            {activeTab === "attendances" ? (
              <div className="w-full t:w-48">
                <Input
                  id="year"
                  name="year"
                  placeholder="Year"
                  required={false}
                  type="date"
                  value={date}
                  onChange={handleDate}
                />
              </div>
            ) : null}
          </div>

          {isLoading ? (
            <PageSkeletonLoader />
          ) : activeTab === "users" ? (
            <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
              {mappedUsers}
            </div>
          ) : activeTab === "attendances" ? (
            <Table
              headers={[
                "Image",
                "First Name",
                "Last Name",
                "Email",
                "In",
                "Out",
                "Late",
                "Absent",
              ]}
              color="blue"
              contents={mappedAttendances}
            />
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
                "Action",
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
                "Action",
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
                "Action",
              ]}
              contents={mappedTrainings}
              color="blue"
            />
          ) : null}
        </div>
      </div>
    </div>
  ) : (
    <div
      className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br 
                from-accent-green/50 via-accent-purple/30 to-accent-blue/50"
    >
      <p className="text-xl animate-fade font-bold">You have no access here.</p>
    </div>
  );
};

export default Management;
