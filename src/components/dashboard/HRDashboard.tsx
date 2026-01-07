import { HRDashboardInterface } from "@/src/interface/DashboardInterface";
import React from "react";
import {
  IoArrowRedoOutline,
  IoArrowUndoOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoDocumentOutline,
  IoEllipsisHorizontalCircleOutline,
  IoFolderOpenOutline,
  IoHelpOutline,
  IoPeopleOutline,
  IoStarOutline,
  IoTimeOutline,
  IoWarningOutline,
} from "react-icons/io5";

const HRDashboard: React.FC<{ dashboard: HRDashboardInterface | null }> = (
  props
) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div
        className="w-full grid grid-cols-1 items-center justify-start max-w-(--breakpoint-l-l) p-2
              t:items-start t:p-4 gap-4 t:grid-cols-2"
      >
        <div className="w-full grid gap-4">
          <div className="rounded-xl bg-neutral-100 p-4 flex flex-col items-start justify-between w-full">
            <div className="flex flex-row items-start justify-between w-full">
              <p className="text-xl font-medium">Head Count</p>
              <div className="p-2 rounded-md bg-accent-blue/50">
                <IoPeopleOutline className="text-2xl text-neutral-100" />
              </div>
            </div>

            <div>
              <p className="text-6xl font-bold">{props.dashboard?.users}</p>
              <p className="">Total Users</p>
            </div>
          </div>

          <div className="w-full p-4 bg-neutral-100 rounded-xl flex flex-col items-start justify-between gap-4">
            <p className="text-xl font-medium">Today&apos;s Attendance</p>

            <div className="w-full h-full grid grid-cols-1 gap-4">
              <div className="p-2 rounded-md w-full h-full flex flex-row items-center gap-2 bg-neutral-200">
                <div className="p-2 rounded-md bg-accent-blue/50 h-full aspect-square text-neutral-100 flex flex-col items-center justify-center">
                  <IoArrowRedoOutline className="text-xl" />
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                  <p>Logged In</p>
                  <p className="text-2xl font-bold text-accent-blue">
                    {props.dashboard?.attendances.in}
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-md w-full h-full flex flex-row items-center gap-2 bg-neutral-200">
                <div className="p-2 rounded-md bg-accent-green/50 h-full aspect-square text-neutral-100 flex flex-col items-center justify-center">
                  <IoArrowUndoOutline className="text-xl" />
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                  <p>Logged Out</p>
                  <p className="text-2xl font-bold text-accent-green">
                    {props.dashboard?.attendances.out}
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-md w-full h-full flex flex-row items-center gap-2 bg-neutral-200">
                <div className="p-2 rounded-md bg-amber-600/50 h-full aspect-square  text-neutral-100 flex flex-col items-center justify-center">
                  <IoWarningOutline className="text-xl" />
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                  <p>Late</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {props.dashboard?.attendances.late}
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-md w-full h-full flex flex-row items-center gap-2 bg-neutral-200">
                <div className="p-2 rounded-md bg-red-600/50 h-full aspect-square  text-neutral-100 flex flex-col items-center justify-center">
                  <IoHelpOutline className="text-xl" />
                </div>
                <div className="w-full flex flex-row items-center justify-between">
                  <p>Absent</p>
                  <p className="text-2xl font-bold text-red-600">
                    {props.dashboard?.attendances.absent}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full p-4 bg-neutral-100 rounded-xl gap-4 flex flex-col items-start justify-between l-l:col-span-1">
          <p className="text-xl font-medium">Leave Requests</p>

          <div className="w-full h-full grid grid-cols-1 gap-4">
            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-purple/50 text-neutral-100">
                <IoEllipsisHorizontalCircleOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Pending</p>
                <p className="font-bold text-accent-purple text-2xl">
                  {props.dashboard?.leaves.pending ?? 0}
                </p>
              </div>
            </div>

            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-green/50 text-neutral-100">
                <IoTimeOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>In Progress</p>
                <p className="font-bold text-accent-green text-2xl">
                  {props.dashboard?.leaves.in_progress ?? 0}
                </p>
              </div>
            </div>

            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-blue/50 text-neutral-100">
                <IoCheckmarkCircleOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Done</p>
                <p className="font-bold text-accent-blue text-2xl">
                  {props.dashboard?.leaves.done ?? 0}
                </p>
              </div>
            </div>

            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-neutral-900/50 text-neutral-100">
                <IoStarOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Approved</p>
                <p className="font-bold text-neutral-900 text-2xl">
                  {props.dashboard?.leaves.approved ?? 0}
                </p>
              </div>
            </div>

            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-red-600/50 text-neutral-100">
                <IoCloseCircleOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Rejected</p>
                <p className="font-bold text-red-600 text-2xl">
                  {props.dashboard?.leaves.rejected ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full p-4 bg-neutral-100 rounded-xl gap-4 flex flex-col items-start justify-between">
          <p className="text-xl font-medium">Employee Onboardings</p>

          <div className="w-full grid grid-cols-1 gap-4">
            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-purple/50 text-neutral-100">
                <IoEllipsisHorizontalCircleOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Pending</p>
                <p className="font-bold text-accent-purple text-2xl">
                  {props.dashboard?.onboardings.pending ?? 0}
                </p>
              </div>
            </div>

            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-green/50 text-neutral-100">
                <IoTimeOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>In Progress</p>
                <p className="font-bold text-accent-green text-2xl">
                  {props.dashboard?.onboardings.in_progress ?? 0}
                </p>
              </div>
            </div>

            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-blue/50 text-neutral-100">
                <IoCheckmarkCircleOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Done</p>
                <p className="font-bold text-accent-blue text-2xl">
                  {props.dashboard?.onboardings.done ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full p-4 bg-neutral-100 rounded-xl gap-4 flex flex-col items-start justify-between">
          <p className="text-xl font-medium">Employee Trainings</p>

          <div className="w-full grid grid-cols-1 gap-4">
            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-purple/50 text-neutral-100">
                <IoEllipsisHorizontalCircleOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Pending</p>
                <p className="font-bold text-accent-purple text-2xl">
                  {props.dashboard?.trainings.pending ?? 0}
                </p>
              </div>
            </div>

            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-green/50 text-neutral-100">
                <IoTimeOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>In Progress</p>
                <p className="font-bold text-accent-green text-2xl">
                  {props.dashboard?.trainings.in_progress ?? 0}
                </p>
              </div>
            </div>

            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-blue/50 text-neutral-100">
                <IoCheckmarkCircleOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Done</p>
                <p className="font-bold text-accent-blue text-2xl">
                  {props.dashboard?.trainings.done ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full p-4 bg-neutral-100 rounded-xl gap-4 flex flex-col items-start justify-between">
          <p className="text-xl font-medium">Employee Performance</p>

          <div className="w-full grid grid-cols-1 gap-4">
            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-purple/50 text-neutral-100">
                <IoEllipsisHorizontalCircleOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Pending</p>
                <p className="font-bold text-accent-purple text-2xl">
                  {props.dashboard?.performances.pending ?? 0}
                </p>
              </div>
            </div>

            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-green/50 text-neutral-100">
                <IoTimeOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>In Progress</p>
                <p className="font-bold text-accent-green text-2xl">
                  {props.dashboard?.performances.in_progress ?? 0}
                </p>
              </div>
            </div>

            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-blue/50 text-neutral-100">
                <IoCheckmarkCircleOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Done</p>
                <p className="font-bold text-accent-blue text-2xl">
                  {props.dashboard?.performances.done ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full p-4 bg-neutral-100 rounded-xl gap-4 flex flex-col items-start justify-between">
          <p className="text-xl font-medium">Documents</p>

          <div className="w-full h-full grid grid-cols-1 gap-4">
            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-blue/50 text-neutral-100">
                <IoDocumentOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Files</p>
                <p className="font-bold text-accent-blue text-2xl">
                  {props.dashboard?.documents.documents ?? 0}
                </p>
              </div>
            </div>

            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-amber-600/50 text-neutral-100">
                <IoFolderOpenOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Folders</p>
                <p className="font-bold text-amber-600 text-2xl">
                  {props.dashboard?.documents.folders ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
