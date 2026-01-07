import { isEmployeeDashboardSummary } from "@/src/utils/utils";
import {
  IoArrowRedoOutline,
  IoArrowUndoOutline,
  IoCheckmarkCircleOutline,
  IoCheckmarkDoneCircleOutline,
  IoCloseCircleOutline,
  IoDocumentOutline,
  IoEllipsisHorizontalCircleOutline,
  IoFolderOpenOutline,
  IoHelpOutline,
  IoStarOutline,
  IoTimeOutline,
  IoWarningOutline,
} from "react-icons/io5";

const EmployeeDashboard: React.FC<{
  dashboard: object;
}> = async ({ dashboard }) => {
  if (!isEmployeeDashboardSummary(dashboard)) {
    return;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div
        className="w-full items-center justify-start max-w-(--breakpoint-l-l) p-2 t:p-4 gap-4
                    grid grid-cols-1 t:grid-cols-2"
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
                    dashboard?.attendances.in
                      ? "bg-accent-green/50"
                      : "bg-red-600/50"
                  }`}
                >
                  {dashboard?.attendances.in ? (
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
                    dashboard?.attendances.out
                      ? "bg-accent-green/50"
                      : "bg-red-600/50"
                  }`}
                >
                  {dashboard?.attendances.out ? (
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
                    dashboard?.attendances.late
                      ? "bg-red-600/50"
                      : "bg-accent-green/50"
                  }`}
                >
                  {dashboard?.attendances.late ? (
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
                    dashboard?.attendances.absent
                      ? "bg-red-600/50"
                      : "bg-accent-green/50"
                  }`}
                >
                  {dashboard?.attendances.absent ? (
                    <IoCheckmarkCircleOutline className="text-2xl" />
                  ) : (
                    <IoCloseCircleOutline className="text-2xl" />
                  )}
                </div>
              </div>
            </div>

            <div className="w-full p-2 rounded-md bg-neutral-200 flex flex-row items-center justify-between gap-2">
              <div className="p-2 rounded-md bg-neutral-900/50 text-neutral-100 w-fit">
                <IoCheckmarkDoneCircleOutline className="text-2xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Logs Done</p>

                <div
                  className={`p-2 rounded-md text-neutral-100 w-fit aspect-square ${
                    dashboard?.attendances.in && dashboard?.attendances.out
                      ? "bg-accent-green/50"
                      : "bg-red-600/50"
                  }`}
                >
                  {dashboard?.attendances.in && dashboard?.attendances.out ? (
                    <IoCheckmarkCircleOutline className="text-2xl" />
                  ) : (
                    <IoCloseCircleOutline className="text-2xl" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full p-4 bg-neutral-100 rounded-xl gap-4 flex flex-col items-start justify-between">
          <p className="text-xl font-medium">Leave Requests</p>

          <div className="w-full h-full grid grid-cols-1 gap-4">
            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-purple/50 text-neutral-100">
                <IoEllipsisHorizontalCircleOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Pending</p>
                <p className="font-bold text-accent-purple text-2xl">
                  {dashboard?.leaves.pending ?? 0}
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
                  {dashboard?.leaves.in_progress ?? 0}
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
                  {dashboard?.leaves.done ?? 0}
                </p>
              </div>
            </div>

            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-amber-600/50 text-neutral-100">
                <IoStarOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Approved</p>
                <p className="font-bold text-amber-600 text-2xl">
                  {dashboard?.leaves.approved ?? 0}
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
                  {dashboard?.leaves.rejected ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full p-4 bg-neutral-100 rounded-xl gap-4 flex flex-col items-start justify-between">
          <p className="text-xl font-medium">Onboardings</p>

          <div className="w-full grid grid-cols-1 gap-4">
            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-purple/50 text-neutral-100">
                <IoEllipsisHorizontalCircleOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Pending</p>
                <p className="font-bold text-accent-purple text-2xl">
                  {dashboard?.onboardings.pending ?? 0}
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
                  {dashboard?.onboardings.in_progress ?? 0}
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
                  {dashboard?.onboardings.done ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full p-4 bg-neutral-100 rounded-xl gap-4 flex flex-col items-start justify-between">
          <p className="text-xl font-medium">Trainings</p>

          <div className="w-full grid grid-cols-1 gap-4">
            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-purple/50 text-neutral-100">
                <IoEllipsisHorizontalCircleOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Pending</p>
                <p className="font-bold text-accent-purple text-2xl">
                  {dashboard?.trainings.pending ?? 0}
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
                  {dashboard?.trainings.in_progress ?? 0}
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
                  {dashboard?.trainings.done ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full p-4 bg-neutral-100 rounded-xl gap-4 flex flex-col items-start justify-between">
          <p className="text-xl font-medium">Performances</p>

          <div className="w-full grid grid-cols-1 gap-4">
            <div className="w-full p-2 bg-neutral-200 rounded-md flex flex-row items-center justify-between gap-2">
              <div className="h-full aspect-square flex flex-col items-center justify-center p-2 rounded-md bg-accent-purple/50 text-neutral-100">
                <IoEllipsisHorizontalCircleOutline className="text-xl" />
              </div>
              <div className="w-full flex flex-row items-center justify-between">
                <p>Pending</p>
                <p className="font-bold text-accent-purple text-2xl">
                  {dashboard?.performances.pending ?? 0}
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
                  {dashboard?.performances.in_progress ?? 0}
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
                  {dashboard?.performances.done ?? 0}
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
                  {dashboard?.documents.documents ?? 0}
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
                  {dashboard?.documents.folders ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
