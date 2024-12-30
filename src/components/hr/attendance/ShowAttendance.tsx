"use client";

import { AttendanceInterface as AttendanceInterface } from "@/src/interface/AttendanceInterface";
import { ShowModalInterface } from "@/src/interface/ModalInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import useGlobalContext from "@/src/utils/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";

interface AttendanceDate {
  date: number;
  month: number;
  year: number;
}

const ShowAttendance: React.FC<ShowModalInterface & AttendanceDate> = (
  props
) => {
  const [attendanceDetails, setAttendanceDetails] = React.useState<
    Array<AttendanceInterface & UserInterface>
  >([]);

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const getAttendanceDetails = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const stringDate = `${props.year}-${props.month + 1}-${props.date}`;
        const { data: details } = await axios.get(
          `${url}/hr/attendance/${stringDate}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
            withCredentials: true,
          }
        );

        if (details) {
          setAttendanceDetails(details.attendances);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.year, props.month, props.date]);

  const mappedAttendanceDetails = attendanceDetails.map(
    (attendanceDetails, index) => {
      const login = attendanceDetails.login_time
        ? `${new Date(
            attendanceDetails.login_time
          ).toLocaleDateString()}\n${new Date(
            attendanceDetails.login_time
          ).toLocaleTimeString()}`
        : "-";

      const logout = attendanceDetails.logout_time
        ? `${new Date(
            attendanceDetails.logout_time
          ).toLocaleDateString()}\n${new Date(
            attendanceDetails.logout_time
          ).toLocaleTimeString()}`
        : "-";

      const late = attendanceDetails.late ? "Yes" : "No";
      const absent = attendanceDetails.absent ? "Yes" : "No";

      return (
        <div
          key={index}
          className="w-full min-w-[768px] grid grid-cols-6 gap-4 border-b-[1px] p-4 *:flex *:flex-row *:items-center *:justify-start"
        >
          <div className="col-span-2  gap-2 flex flex-row items-center justify-start">
            <div className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-accent-purple" />
            <p className=" truncate">
              {attendanceDetails.first_name} {attendanceDetails.last_name}
            </p>
          </div>
          <p className="whitespace-pre">{login}</p>
          <p className="whitespace-pre">{logout}</p>
          <p>{late}</p>
          <p>{absent}</p>
        </div>
      );
    }
  );

  React.useEffect(() => {
    getAttendanceDetails();
  }, [getAttendanceDetails]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
      p-4 t:p-8 z-50 bg-gradient-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-auto max-w-screen-l-s bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "Attendance Details"}
          <button
            onClick={() => props.setActiveModal(0)}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full h-full p-4 flex flex-col items-center justify-center overflow-x-auto">
          <div className="w-full flex flex-col items-start justify-center overflow-x-auto border-[1px] rounded-md">
            <div className="w-full min-w-[768px] grid grid-cols-6 font-bold gap-4 bg-neutral-200 p-4">
              <p className="col-span-2">Employee</p>
              <p>Log In</p>
              <p>Log Out</p>
              <p>Late</p>
              <p>Absent</p>
            </div>

            <div className="w-full h-full flex flex-col items-start justify-center">
              {mappedAttendanceDetails}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowAttendance;
