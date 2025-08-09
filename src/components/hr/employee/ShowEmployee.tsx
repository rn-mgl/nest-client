"use client";

import LeaveCard from "@/global/leave/LeaveCard";
import OnboardingCard from "@/global/onboarding/OnboardingCard";
import PerformanceReviewCard from "@/global/performance/PerformanceReviewCard";
import TrainingCard from "@/global/training/TrainingCard";
import ShowOnboarding from "@/hr/onboarding/ShowOnboarding";
import ShowPerformanceReview from "@/hr/performance/ShowPerformanceReview";
import ShowTraining from "@/hr/training/ShowTraining";
import Table from "@/src/components/global/field/Table";
import {
  LeaveBalanceInterface,
  LeaveTypeInterface,
  LeaveRequestInterface,
} from "@/src/interface/LeaveInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
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
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { IoClose, IoMail } from "react-icons/io5";

const ShowEmployee: React.FC<ModalInterface> = (props) => {
  const [employee, setEmployee] = React.useState<UserInterface>({
    email: "",
    email_verified_at: "",
    first_name: "",
    last_name: "",
    user_id: 0,
    image: "",
  });
  const [onboardings, setOnboardings] = React.useState<
    (EmployeeOnboardingInterface & OnboardingInterface & UserInterface)[]
  >([]);
  const [leaveBalances, setLeaveBalances] = React.useState<
    (LeaveBalanceInterface & LeaveTypeInterface & UserInterface)[]
  >([]);
  const [leaveRequests, setLeaveRequests] = React.useState<
    (LeaveRequestInterface & LeaveTypeInterface)[]
  >([]);
  const [performanceReviews, setPerformanceReviews] = React.useState<
    (EmployeePerformanceReviewInterface &
      PerformanceReviewInterface &
      UserInterface)[]
  >([]);
  const [trainings, setTrainings] = React.useState<
    (EmployeeTrainingInterface & TrainingInterface & UserInterface)[]
  >([]);

  const [activeOnboardingSeeMore, setActiveOnboardingSeeMore] =
    React.useState(0);
  const [activePerformanceReviewSeeMore, setActivePerformanceReviewSeeMore] =
    React.useState(0);
  const [activeTrainingSeeMore, setActiveTrainingSeeMore] = React.useState(0);

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const getEmployee = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/hr/employee/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
          }
        );

        if (responseData) {
          setEmployee(responseData.employee);
          setOnboardings(responseData.onboardings);
          setLeaveBalances(responseData.leave_balances);
          setLeaveRequests(responseData.leave_requests);
          setPerformanceReviews(responseData.performance_reviews);
          setTrainings(responseData.trainings);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.token, url, props.id]);

  const sendMail = () => {
    location.href = `mailto:${employee.email}`;
  };

  const handleActiveOnboardingSeeMore = (id: number) => {
    setActiveOnboardingSeeMore((prev) => (prev === id ? 0 : id));
  };

  const handleActivePerformanceReviewSeeMore = (id: number) => {
    setActivePerformanceReviewSeeMore((prev) => (prev === id ? 0 : id));
  };

  const handleActiveTrainingSeeMore = (id: number) => {
    setActiveTrainingSeeMore((prev) => (prev === id ? 0 : id));
  };

  const mappedOnboardings = onboardings.map((onboarding, index) => {
    const createdBy = onboarding.created_by === user?.current;

    return (
      <OnboardingCard
        key={index}
        createdBy={createdBy}
        role="employee" // set role as employee for the card view
        // onboarding
        title={onboarding.title}
        description={onboarding.description}
        status={onboarding.status.replaceAll("_", " ")}
        // user
        email={onboarding.email}
        first_name={onboarding.first_name}
        last_name={onboarding.last_name}
        user_id={onboarding.user_id}
        //
        handleActiveSeeMore={() =>
          handleActiveOnboardingSeeMore(onboarding.onboarding_id ?? 0)
        }
      />
    );
  });

  const mappedLeaveBalances = leaveBalances.map((leave, index) => {
    const createdBy = leave.created_by === user?.current;

    return (
      <LeaveCard
        key={index}
        createdBy={createdBy}
        role="employee" // set role as employee for the card view
        //
        type={leave.type}
        description={leave.description}
        balance={leave.balance}
        //
        email={leave.email}
        first_name={leave.first_name}
        last_name={leave.last_name}
        user_id={leave.user_id}
      />
    );
  });

  const mappedLeaveRequests = leaveRequests.map((leave) => {
    const startDate = new Date(leave.start_date).toLocaleDateString();
    const startTime = new Date(leave.start_date).toLocaleTimeString();
    const endDate = new Date(leave.end_date).toLocaleDateString();
    const endTime = new Date(leave.end_date).toLocaleTimeString();

    return {
      type: leave.type,
      reason: leave.reason,
      status: (
        <span className="capitalize">{leave.status.replaceAll("_", " ")}</span>
      ),
      start_date: `${startDate} ${startTime}`,
      end_date: `${endDate} ${endTime}`,
    };
  });

  const mappedPerformanceReviews = performanceReviews.map(
    (performance, index) => {
      const createdBy = performance.created_by === user?.current;

      return (
        <PerformanceReviewCard
          key={index}
          createdBy={createdBy}
          role="employee"
          //
          title={performance.title}
          description={performance.description}
          status={performance.status.replaceAll("_", " ")}
          //
          email={performance.email}
          first_name={performance.first_name}
          last_name={performance.last_name}
          user_id={performance.user_id}
          //
          handleActiveSeeMore={() =>
            handleActivePerformanceReviewSeeMore(
              performance.performance_review_id ?? 0
            )
          }
        />
      );
    }
  );

  const mappedTrainings = trainings.map((training, index) => {
    const createdBy = training.created_by === user?.current;
    const deadlineDate = new Date(training.deadline).toLocaleDateString();
    const deadlineTime = new Date(training.deadline).toLocaleTimeString();
    const deadline = `${deadlineDate} ${deadlineTime}`;

    return (
      <TrainingCard
        key={index}
        createdBy={createdBy}
        role="employee"
        //
        title={training.title}
        description={training.description}
        certificate={training.certificate}
        deadline_days={training.deadline_days}
        deadline={deadline}
        created_by={training.created_by}
        status={training.status.replaceAll("_", " ")}
        score={training.score}
        //
        email={training.email}
        first_name={training.first_name}
        last_name={training.last_name}
        user_id={training.user_id}
        //
        handleActiveSeeMore={() =>
          handleActiveTrainingSeeMore(training.training_id ?? 0)
        }
      />
    );
  });

  React.useEffect(() => {
    getEmployee();
  }, [getEmployee]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
      p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-hidden"
    >
      {activeOnboardingSeeMore ? (
        <ShowOnboarding
          toggleModal={() =>
            handleActiveOnboardingSeeMore(activeOnboardingSeeMore)
          }
          id={activeOnboardingSeeMore}
        />
      ) : null}

      {activePerformanceReviewSeeMore ? (
        <ShowPerformanceReview
          toggleModal={() =>
            handleActivePerformanceReviewSeeMore(activePerformanceReviewSeeMore)
          }
          id={activePerformanceReviewSeeMore}
        />
      ) : null}

      {activeTrainingSeeMore ? (
        <ShowTraining
          toggleModal={() => handleActiveTrainingSeeMore(activeTrainingSeeMore)}
          id={activeTrainingSeeMore}
        />
      ) : null}

      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "Employee Details"}
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
                className={`absolute w-28 h-28 overflow-hidden rounded-full border-8 border-neutral-100 flex flex-col items-center justify-center
                        bottom-0 translate-y-2/4 ${
                          typeof employee.image === "string" &&
                          employee.image !== ""
                            ? "bg-accent-purple/30 backdrop-blur-lg"
                            : "bg-accent-purple"
                        }`}
              >
                {typeof employee.image === "string" && employee.image !== "" ? (
                  <Image
                    src={employee.image}
                    alt="profile"
                    className="absolute"
                    width={300}
                    height={300}
                  />
                ) : null}
              </div>
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
            <div className="w-full p-2 rounded-md bg-accent-purple text-center text-neutral-100 font-bold">
              Onboardings
            </div>
            {onboardings.length ? (
              <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2">
                {mappedOnboardings}
              </div>
            ) : (
              <div>No Onboardings Found</div>
            )}
          </div>

          {/* leave balances */}
          <div className="w-full flex flex-col items-center justify-center gap-4 p-2 bg-white rounded-md t:p-4">
            <div className="w-full p-2 rounded-md bg-accent-purple font-bold text-neutral-100 text-center">
              Leave Balances
            </div>
            {leaveBalances.length ? (
              <div className="w-full grid grid-cols-1 t:grid-cols-2 gap-4">
                {mappedLeaveBalances}
              </div>
            ) : (
              <div>No Leaves Found</div>
            )}
          </div>

          {/* leave requests */}
          <div className="w-full p-2 flex flex-col items-center justify-start rounded-md bg-white t:p-4 gap-4">
            <div className="w-full p-2 rounded-md bg-accent-purple text-neutral-100 font-bold text-center">
              Leave Requests
            </div>

            {leaveRequests.length ? (
              <div className="w-full overflow-x-auto flex flex-col items-start justify-start">
                <Table
                  headers={["Leave Type", "Reason", "Status", "Start", "End"]}
                  contents={mappedLeaveRequests}
                  color="neutral"
                />
              </div>
            ) : (
              <div>No Leave Requests Found</div>
            )}
          </div>

          {/* performance reviews */}
          <div className="w-full p-2 rounded-md bg-white t:p-4 flex flex-col items-center justify-start gap-4">
            <div className="w-full p-2 rounded-md bg-accent-purple font-bold text-neutral-100 text-center">
              Performance Reviews
            </div>

            {performanceReviews.length ? (
              <div className="w-full grid grid-cols-1 t:grid-cols-2 gap-4">
                {mappedPerformanceReviews}
              </div>
            ) : (
              <div>No Performance Reviews Found</div>
            )}
          </div>

          {/* trainings */}
          <div className="w-full p-2 rounded-md bg-white t:p-4 flex flex-col items-center justify-start gap-4">
            <div className="w-full p-2 rounded-md bg-accent-purple text-neutral-100 font-bold text-center">
              Trainings
            </div>
            {trainings.length ? (
              <div className="w-full grid grid-cols-1 t:grid-cols-2 gap-4">
                {mappedTrainings}
              </div>
            ) : (
              <div>No Trainings Found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowEmployee;
