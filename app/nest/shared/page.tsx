"use client";

import AdminDashboard from "@/src/components/dashboard/AdminDashboard";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import { useToasts } from "@/src/context/ToastContext";
import useIsLoading from "@/src/hooks/useIsLoading";
import {
  AdminDashboardInterface,
  EmployeeDashboardInterface,
  HRDashboardInterface,
} from "@/src/interface/DashboardInterface";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import HRDashboard from "@/components/dashboard/HRDashboard";
import EmployeeDashboard from "@/src/components/dashboard/EmployeeDashboard";

const Employee = () => {
  const [dashboard, setDashboard] = React.useState<
    | EmployeeDashboardInterface
    | HRDashboardInterface
    | AdminDashboardInterface
    | null
  >(null);
  const { isLoading, handleIsLoading } = useIsLoading();
  const { addToast } = useToasts();

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const getDashboard = React.useCallback(
    async (controller: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token) {
          const { data: responseData } =
            await axios.get<EmployeeDashboardInterface>(`${url}/dashboard`, {
              headers: { Authorization: `Bearer ${user.token}` },
              withCredentials: true,
              signal: controller.signal,
            });

          if (responseData) {
            setDashboard(responseData);
          }
        }
      } catch (error) {
        console.log(error);

        if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the dashboard data is being retrieved";
          addToast("Dashboard Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, addToast, handleIsLoading]
  );

  React.useEffect(() => {
    const controller = new AbortController();

    getDashboard(controller);

    return () => {
      controller.abort();
    };
  }, [getDashboard]);

  if (isLoading) {
    return <PageSkeletonLoader />;
  }

  return user?.role.includes("admin") && dashboard && "hrs" in dashboard ? (
    <AdminDashboard dashboard={dashboard} />
  ) : user?.role.includes("hr") && dashboard && "users" in dashboard ? (
    <HRDashboard dashboard={dashboard} />
  ) : user?.role.includes("employee") &&
    dashboard &&
    "attendances" in dashboard &&
    !("users" in dashboard) ? (
    <EmployeeDashboard dashboard={dashboard} />
  ) : null;
};

export default Employee;
