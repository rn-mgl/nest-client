"use client";

import { EmployeeDashboardInterface } from "@/src/interface/DashboardInterface";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import {
  IoArrowRedoOutline,
  IoArrowUndoOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoHelpOutline,
  IoWarningOutline,
} from "react-icons/io5";

const Employee = () => {
  const [dashboard, setDashboard] = React.useState<EmployeeDashboardInterface>({
    attendances: {
      absent: false,
      in: false,
      out: false,
      late: false,
    },
    documents: {
      documents: 0,
      folders: 0,
    },
    leaves: {
      done: 0,
      approved: 0,
      in_progress: 0,
      pending: 0,
      rejected: 0,
    },
    onboardings: {
      done: 0,
      in_progress: 0,
      pending: 0,
    },
    performances: {
      done: 0,
      in_progress: 0,
      pending: 0,
    },
    trainings: {
      done: 0,
      in_progress: 0,
      pending: 0,
    },
  });

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const getDashboard = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } =
          await axios.get<EmployeeDashboardInterface>(
            `${url}/employee/dashboard`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
              withCredentials: true,
            }
          );

        if (responseData) {
          setDashboard(responseData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token]);

  React.useEffect(() => {
    getDashboard();
  }, [getDashboard]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div
        className="w-full items-center justify-start max-w-(--breakpoint-l-l) p-2 t:p-4 gap-4 t:gap-8 
                  grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3"
      >
        <div className="w-full h-full p-4 rounded-lg bg-neutral-100  gap-4 flex flex-col items-start justify-start">
          <p className="font-medium text-xl">Today&apos;s Attendance</p>

          <div className="w-full grid grid-cols-1 gap-4">
            <div className="w-full p-2 rounded-md bg-neutral-200 flex flex-row items-center justify-between gap-2">
              <div className="bg-accent-blue/50 text-neutral-100 flex flex-col items-center justify-center aspect-square w-fit p-2 rounded-md">
                <IoArrowRedoOutline className="text-2xl" />
              </div>

              <div className="w-full flex flex-row items-center justify-between">
                <p>Logged In</p>

                <div
                  className={`p-2 rounded-md text-neutral-100 w-fit aspect-square ${
                    dashboard.attendances.in
                      ? "bg-accent-green/50"
                      : "bg-red-600/50"
                  }`}
                >
                  {dashboard.attendances.in ? (
                    <IoCheckmarkCircleOutline className="text-2xl" />
                  ) : (
                    <IoCloseCircleOutline className="text-2xl" />
                  )}
                </div>
              </div>
            </div>

            <div className="w-full p-2 rounded-md bg-neutral-200 flex flex-row items-center justify-between gap-2">
              <div className="bg-accent-green/50 text-neutral-100 flex flex-col items-center justify-center aspect-square w-fit p-2 rounded-md">
                <IoArrowUndoOutline className="text-2xl" />
              </div>

              <div className="w-full flex flex-row items-center justify-between">
                <p>Logged Out</p>

                <div
                  className={`p-2 rounded-md text-neutral-100 w-fit aspect-square ${
                    dashboard.attendances.out
                      ? "bg-accent-green/50"
                      : "bg-red-600/50"
                  }`}
                >
                  {dashboard.attendances.out ? (
                    <IoCheckmarkCircleOutline className="text-2xl" />
                  ) : (
                    <IoCloseCircleOutline className="text-2xl" />
                  )}
                </div>
              </div>
            </div>

            <div className="w-full p-2 rounded-md bg-neutral-200 flex flex-row items-center justify-between gap-2">
              <div className="bg-amber-600/50 text-neutral-100 flex flex-col items-center justify-center aspect-square w-fit p-2 rounded-md">
                <IoWarningOutline className="text-2xl" />
              </div>

              <div className="w-full flex flex-row items-center justify-between">
                <p>Late</p>

                <div
                  className={`p-2 rounded-md text-neutral-100 w-fit aspect-square ${
                    dashboard.attendances.late
                      ? "bg-red-600/50"
                      : "bg-accent-green/50"
                  }`}
                >
                  {dashboard.attendances.late ? (
                    <IoCheckmarkCircleOutline className="text-2xl" />
                  ) : (
                    <IoCloseCircleOutline className="text-2xl" />
                  )}
                </div>
              </div>
            </div>

            <div className="w-full p-2 rounded-md bg-neutral-200 flex flex-row items-center justify-between gap-2">
              <div className="bg-red-600/50 text-neutral-100 flex flex-col items-center justify-center aspect-square w-fit p-2 rounded-md">
                <IoHelpOutline className="text-2xl" />
              </div>

              <div className="w-full flex flex-row items-center justify-between">
                <p>Absent</p>

                <div
                  className={`p-2 rounded-md text-neutral-100 w-fit aspect-square ${
                    dashboard.attendances.absent
                      ? "bg-red-600/50"
                      : "bg-accent-green/50"
                  }`}
                >
                  {dashboard.attendances.absent ? (
                    <IoCheckmarkCircleOutline className="text-2xl" />
                  ) : (
                    <IoCloseCircleOutline className="text-2xl" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
