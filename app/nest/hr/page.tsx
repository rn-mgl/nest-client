"use client";

import { HRDashboardInterface } from "@/src/interface/DashboardInterface";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const HRDashboard = () => {
  const [dashboard, setDashboards] = React.useState<HRDashboardInterface>({
    attendances: { In: 0, Absent: 0, Late: 0, Out: 0 },
    documents: 0,
    leaves: {
      "In Progress": 0,
      Approved: 0,
      Done: 0,
      Pending: 0,
      Rejected: 0,
    },
    onboardings: {
      "In Progress": 0,
      Done: 0,
      Pending: 0,
    },
    performances: { "In Progress": 0, Done: 0, Pending: 0 },
    trainings: { "In Progress": 0, Done: 0, Pending: 0 },
    users: 0,
  });

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const getDashboard = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get(`${url}/hr/dashboard`, {
          headers: { Authorization: `Bearer ${user?.token}` },
          withCredentials: true,
        });

        console.log(responseData);
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
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        HRDashboard
      </div>
    </div>
  );
};

export default HRDashboard;
