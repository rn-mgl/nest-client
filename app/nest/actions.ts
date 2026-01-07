"use server";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { APIReturnInterface } from "@/src/interface/APIInterface";
import {
  AdminDashboardInterface,
  EmployeeDashboardInterface,
  HRDashboardInterface,
} from "@/src/interface/DashboardInterface";
import axios from "axios";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

export const getDashboard = async (): Promise<APIReturnInterface> => {
  const url = process.env.URL;

  const session = await getServerSession(authOptions);
  const user = session?.user;

  const cookieStore = await cookies();

  const token = user?.token;

  if (!token) {
    return {
      success: false,
      data: null,
      error: "No authentication token applied.",
    };
  }

  try {
    console.log(cookieStore.toString());
    console.log(token);

    const { data: responseData } = await axios.get<
      | AdminDashboardInterface
      | HRDashboardInterface
      | EmployeeDashboardInterface
    >(`${url}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: cookieStore.toString(),
      },
      withCredentials: true,
    });

    return {
      success: true,
      data: responseData,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: axios.isAxiosError(error)
        ? error.response?.data.message ?? "Failed to fetch dashboard data"
        : "An unexpected error occurred",
    };
  }
};
