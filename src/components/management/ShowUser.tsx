"use client";

import Table from "@/src/components/global/field/Table";
import { useToasts } from "@/src/context/ToastContext";
import {
  LeaveBalanceInterface,
  LeaveRequestInterface,
} from "@/src/interface/LeaveInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { UserOnboardingInterface } from "@/src/interface/OnboardingInterface";
import { UserPerformanceReviewInterface } from "@/src/interface/PerformanceReviewInterface";
import { UserTrainingInterface } from "@/src/interface/TrainingInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  isCloudFileSummary,
  isUserSummary,
  normalizeDate,
  normalizeString,
} from "@/src/utils/utils";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose, IoMail } from "react-icons/io5";

const ShowUser: React.FC<ModalInterface> = (props) => {
  const [employee, setUser] = React.useState<UserInterface>({
    email: "",
    verification_status: "Deactivated",
    email_verified_at: "",
    first_name: "",
    last_name: "",
    id: 0,
    image: null,
  });
  const [onboardings, setOnboardings] = React.useState<
    UserOnboardingInterface[]
  >([]);
  const [leaveBalances, setLeaveBalances] = React.useState<
    LeaveBalanceInterface[]
  >([]);
  const [leaveRequests, setLeaveRequests] = React.useState<
    LeaveRequestInterface[]
  >([]);
  const [performanceReviews, setPerformanceReviews] = React.useState<
    UserPerformanceReviewInterface[]
  >([]);
  const [trainings, setTrainings] = React.useState<UserTrainingInterface[]>([]);

  const { addToast } = useToasts();

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const userToken = user?.token;
  const url = process.env.URL;

  const getUser = React.useCallback(async () => {
    try {
      if (userToken) {
        const { data: responseData } = await axios.get(
          `${url}/management/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
            withCredentials: true,
          }
        );

        if (responseData) {
          setUser(responseData.employee);
          setOnboardings(responseData.onboardings);
          setLeaveBalances(responseData.leave_balances);
          setLeaveRequests(responseData.leave_requests);
          setPerformanceReviews(responseData.performance_reviews);
          setTrainings(responseData.trainings);
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the employee data is being retrieved";
        addToast("User Error", message, "error");
      }
    }
  }, [userToken, url, props.id, addToast]);

  const sendMail = () => {
    location.href = `mailto:${employee.email}`;
  };

  const mappedOnboardings = onboardings.map((onboarding) => {
    const assignedBy = isUserSummary(onboarding.assigned_by)
      ? onboarding.assigned_by
      : null;
    const assignedOn = normalizeDate(onboarding.created_at);

    return {
      title: onboarding.onboarding.title,
      description: onboarding.onboarding.description,
      status: normalizeString(onboarding.status),
      assigned_on: assignedOn,
      assigned_by: `${assignedBy?.first_name} ${assignedBy?.last_name}`,
    };
  });

  const mappedLeaveBalances = leaveBalances.map((leave) => {
    const providedBy = isUserSummary(leave.provided_by)
      ? leave.provided_by
      : null;
    const providedOn = normalizeDate(leave.created_at);

    return {
      leave_type: leave.leave.type,
      description: leave.leave.description,
      balance: leave.balance,
      provided_on: providedOn,
      provided_by: `${providedBy?.first_name} ${providedBy?.last_name}`,
    };
  });

  const mappedLeaveRequests = leaveRequests.map((leave) => {
    const startOn = normalizeDate(leave.start_date);
    const endOn = normalizeDate(leave.end_date);
    const requestedOn = normalizeDate(leave.created_at);

    return {
      type: leave.leave.type,
      reason: leave.reason,
      status: normalizeString(leave.status),
      requested_on: requestedOn,
      start_date: startOn,
      end_date: endOn,
    };
  });

  const mappedPerformanceReviews = performanceReviews.map((performance) => {
    const assignedBy = isUserSummary(performance.assigned_by)
      ? performance.assigned_by
      : null;
    const assignedOn = normalizeDate(performance.created_at);

    return {
      title: performance.performance_review.title,
      description: performance.performance_review.description,
      status: normalizeString(performance.status),
      assigned_on: assignedOn,
      assigned_by: `${assignedBy?.first_name} ${assignedBy?.last_name}`,
    };
  });

  const mappedTrainings = trainings.map((training) => {
    const assignedBy = isUserSummary(training.assigned_by)
      ? training.assigned_by
      : null;
    const deadlineDate =
      typeof training.deadline === "string"
        ? normalizeDate(training.deadline)
        : "-";
    const assignedOn = normalizeDate(training.created_at);

    return {
      title: training.training.title,
      description: training.training.description,
      status: normalizeString(training.status),
      deadline: deadlineDate,
      assigned_on: assignedOn,
      assigned_by: `${assignedBy?.first_name} ${assignedBy?.last_name}`,
    };
  });

  React.useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
      p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-hidden"
    >
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-l) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "User Details"}
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>

        <div className="w-full h-full p-2 flex flex-col items-center justify-start overflow-y-auto gap-4 t:p-4">
          {/* employee info */}
          <div className="w-full h-auto flex flex-col items-center justify-start">
            {/* photo and header */}
            <div className="w-full p-2 rounded-md bg-gradient-to-br from-accent-blue/30 to-accent-purple/30 h-32 t:h-40 relative flex flex-col items-center justify-center">
              <div
                style={{
                  backgroundImage: isCloudFileSummary(employee.image)
                    ? `url(${employee.image.url})`
                    : "",
                }}
                className="absolute w-28 h-28 overflow-hidden rounded-full border-8 border-neutral-100 flex flex-col items-center justify-center
                        bottom-0 translate-y-2/4 bg-center bg-cover bg-accent-blue"
              />
            </div>

            {/* name and email */}
            <div className="w-full p-2 flex flex-col items-center justify-center mt-14">
              <p className="font-bold text-lg l-l:text-2xl">
                {employee.first_name} {employee.last_name}
              </p>
              <button
                onClick={sendMail}
                className="text-accent-purple hover:underline underline-offset-2 gap-1 flex flex-row items-center justify-center text-sm l-l:text-base"
              >
                <IoMail /> <span>{employee.email}</span>
              </button>
            </div>
          </div>

          {/* onboardings */}
          <div className="w-full flex flex-col items-center justify-center gap-4 p-2 rounded-md bg-white t:p-4">
            <div className="w-full p-2 rounded-md bg-accent-purple text-center text-neutral-100 font-medium">
              Onboardings
            </div>
            <div className="w-full flex flex-col items-center justify-start overflow-hidden">
              <Table
                color="neutral"
                contents={mappedOnboardings}
                headers={[
                  "Title",
                  "Description",
                  "Status",
                  "Assigned On",
                  "Assigned By",
                ]}
              />
            </div>
          </div>

          {/* leave balances */}
          <div className="w-full flex flex-col items-center justify-center gap-4 p-2 bg-white rounded-md t:p-4">
            <div className="w-full p-2 rounded-md bg-accent-purple font-medium text-neutral-100 text-center">
              Leave Balances
            </div>
            <div className="w-full flex flex-col items-center justify-start overflow-hidden">
              <Table
                color="neutral"
                contents={mappedLeaveBalances}
                headers={[
                  "Leave Type",
                  "Description",
                  "Balance",
                  "Provided On",
                  "Provided By",
                ]}
              />
            </div>
          </div>

          {/* leave requests */}
          <div className="w-full p-2 flex flex-col items-center justify-start rounded-md bg-white t:p-4 gap-4">
            <div className="w-full p-2 rounded-md bg-accent-purple text-neutral-100 font-medium text-center">
              Leave Requests
            </div>

            <div className="w-full flex flex-col items-center justify-start overflow-hidden">
              <Table
                headers={[
                  "Leave Type",
                  "Reason",
                  "Status",
                  "Requested On",
                  "Start",
                  "End",
                ]}
                contents={mappedLeaveRequests}
                color="neutral"
              />
            </div>
          </div>

          {/* performance reviews */}
          <div className="w-full p-2 rounded-md bg-white t:p-4 flex flex-col items-center justify-start gap-4">
            <div className="w-full p-2 rounded-md bg-accent-purple font-medium text-neutral-100 text-center">
              Performance Reviews
            </div>

            <div className="w-full flex flex-col items-center justify-start overflow-hidden">
              <Table
                color="neutral"
                contents={mappedPerformanceReviews}
                headers={[
                  "Title",
                  "Description",
                  "Status",
                  "Assigned On",
                  "Assigned By",
                ]}
              />
            </div>
          </div>

          {/* trainings */}
          <div className="w-full p-2 rounded-md bg-white t:p-4 flex flex-col items-center justify-start gap-4">
            <div className="w-full p-2 rounded-md bg-accent-purple text-neutral-100 font-medium text-center">
              Trainings
            </div>
            <div className="w-full flex flex-col items-center justify-start overflow-hidden">
              <Table
                color="neutral"
                contents={mappedTrainings}
                headers={[
                  "Title",
                  "Description",
                  "Status",
                  "Deadline",
                  "Assigned On",
                  "Assigned By",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUser;
