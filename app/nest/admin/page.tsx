"use client";
import { AdminDashboardInterface } from "@/src/interface/DashboardInterface";
import { isCloudFileSummary } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import {
  IoPeopleOutline,
  IoShieldCheckmarkOutline,
  IoWarningOutline,
} from "react-icons/io5";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = React.useState<AdminDashboardInterface>({
    hrs: [],
  });

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const activatedHRs = dashboard.hrs.filter(
    (hr) => hr.email_verified_at !== null
  );

  const deactivatedHRs = dashboard.hrs.filter(
    (hr) => hr.email_verified_at === null
  );

  const latestHRs = dashboard.hrs
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
    .map((hr, index) => {
      return (
        <div
          key={index}
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

  const getDashboard = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<AdminDashboardInterface>(
          `${url}/admin/dashboard`,
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

            <div className="text-3xl font-bold">{dashboard.hrs.length}</div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4">
            <div className="w-full aspect-square bg-neutral-100 rounded-lg p-4 flex flex-col items-start justify-between">
              <div className="text-lg font-medium flex flex-row items-center justify-between gap-2 w-full">
                <p>Verified</p>
                <div className="p-2 aspect-square rounded-md bg-accent-green/50 text-neutral-100">
                  <IoShieldCheckmarkOutline className="text-sm" />
                </div>
              </div>

              <p className="text-3xl font-bold">{activatedHRs.length}</p>
            </div>

            <div className="w-full aspect-square bg-neutral-100 rounded-lg p-4 flex flex-col items-start justify-between">
              <div className="text-lg font-medium flex flex-row items-center justify-between gap-2 w-full">
                <p className="w-full truncate">Deactivated</p>
                <div className="p-2 aspect-square rounded-md bg-red-600/50 text-neutral-100">
                  <IoWarningOutline className="text-sm" />
                </div>
              </div>

              <p className="text-3xl font-bold">{deactivatedHRs.length}</p>
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
