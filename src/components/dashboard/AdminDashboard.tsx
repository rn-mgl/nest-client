"use client";

import { useToasts } from "@/src/context/ToastContext";
import { APIReturnInterface } from "@/src/interface/APIInterface";
import { isAdminDashboardSummary, isCloudFileSummary } from "@/src/utils/utils";
import React from "react";
import {
  IoPeopleOutline,
  IoShieldCheckmarkOutline,
  IoWarningOutline,
} from "react-icons/io5";

const AdminDashboard: React.FC<{
  dashboard: APIReturnInterface;
}> = ({ dashboard }) => {
  const { addToast } = useToasts();

  const content = React.useMemo(() => {
    return isAdminDashboardSummary(dashboard.data)
      ? dashboard.data
      : { hrs: [] };
  }, [dashboard.data]);

  const activatedHRs = content.hrs.filter(
    (hr) => hr.email_verified_at !== null
  );

  const deactivatedHRs = content.hrs.filter(
    (hr) => hr.email_verified_at === null
  );

  const latestHRs = content.hrs
    .filter((hr) => {
      if (!hr.created_at) return false;

      const today = new Date();
      const dayOfWeek = today.getDay();

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 59);

      const dateToCheck = new Date(hr.created_at);

      // Compare the dateToCheck with the calculated week range
      return dateToCheck >= startOfWeek && dateToCheck <= endOfWeek;
    })
    .map((hr) => {
      return (
        <div
          key={hr.id}
          className="p-2 rounded-md bg-neutral-200 flex flex-row items-center justify-between gap-4 w-full"
        >
          <div
            style={{
              backgroundImage: isCloudFileSummary(hr.image)
                ? `url(${hr.image.url})`
                : "",
            }}
            className={`rounded-full relative aspect-square p-4 ${
              isCloudFileSummary(hr.image)
                ? "bg-accent-blue/30"
                : "bg-accent-blue"
            } flex flex-col items-center justify-center overflow-clip bg-center bg-cover`}
          ></div>

          <div className="w-full flex flex-col items-start justify-center">
            <p className="font-bold">
              {hr.first_name} {hr.last_name}
            </p>
            <p className="text-xs font-light">{hr.email}</p>
          </div>
        </div>
      );
    });

  React.useEffect(() => {
    if (!dashboard.success) {
      addToast(
        "Dashboard Error",
        dashboard.error ?? "An error occurred",
        "error"
      );
    }
  }, [dashboard.success, dashboard.error, addToast]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div
        className="w-full grid grid-cols-1 items-center justify-start max-w-(--breakpoint-l-l) p-2
            t:items-start t:p-4 gap-4 t:grid-cols-2 l-l:grid-cols-3"
      >
        <div className="w-full aspect-square grid grid-rows-2 gap-4">
          <div className="p-4 rounded-md bg-neutral-100 flex flex-col items-start justify-between">
            <div className="w-full flex flex-row items-start justify-between">
              <p className="text-xl font-medium">HRs Count</p>

              <div className="p-2 rounded-md bg-accent-blue/50 text-neutral-100">
                <IoPeopleOutline className="text-2xl" />
              </div>
            </div>

            <div className="text-3xl font-bold">{content.hrs.length}</div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4">
            <div className="w-full aspect-square bg-neutral-100 rounded-lg p-4 flex flex-col items-start justify-between">
              <div className="text-lg font-medium flex flex-row items-center justify-between gap-2 w-full">
                <p>Verified</p>
                <div className="p-2 aspect-square rounded-md bg-accent-green/50 text-neutral-100">
                  <IoShieldCheckmarkOutline className="text-sm" />
                </div>
              </div>

              <p className="text-3xl font-bold">{activatedHRs?.length}</p>
            </div>

            <div className="w-full aspect-square bg-neutral-100 rounded-lg p-4 flex flex-col items-start justify-between">
              <div className="text-lg font-medium flex flex-row items-center justify-between gap-2 w-full">
                <p className="w-full truncate">Deactivated</p>
                <div className="p-2 aspect-square rounded-md bg-red-600/50 text-neutral-100">
                  <IoWarningOutline className="text-sm" />
                </div>
              </div>

              <p className="text-3xl font-bold">{deactivatedHRs?.length}</p>
            </div>
          </div>
        </div>

        <div className="w-full h-full aspect-square gap-4 bg-neutral-100 rounded-lg p-4 flex flex-col items-start justify-start">
          <p className="text-xl font-medium">New HR Accounts</p>

          <div className="w-full h-full overflow-y-auto flex flex-col items-center justify-start gap-2">
            {latestHRs}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
