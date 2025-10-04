"use client";

import { useToasts } from "@/src/context/ToastContext";
import { AttendanceInterface } from "@/src/interface/AttendanceInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { isCloudFileSummary, normalizeDate } from "@/src/utils/utils";
import axios, { isAxiosError } from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";

interface AttendanceDate {
  date: number;
  month: number;
  year: number;
}

const ShowAttendance: React.FC<ModalInterface & AttendanceDate> = (props) => {
  const [userAttendances, setUserAttendances] = React.useState<
    (UserInterface & { attendance: AttendanceInterface })[]
  >([]);

  const { addToast } = useToasts();

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const getAttendanceDetails = React.useCallback(
    async (abort: AbortController) => {
      try {
        if (user?.token) {
          const stringDate = `${props.year}-${props.month + 1}-${props.date}`;
          const { data: details } = await axios.get(
            `${url}/hr/attendance/${stringDate}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
              withCredentials: true,
              signal: abort.signal,
            }
          );

          if (details) {
            setUserAttendances(details.attendances);
          }
        }
      } catch (error) {
        console.log(error);

        if (isAxiosError(error)) {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the employee attendance is being retrieved";
          addToast("Attendance Error", message, "error");
        }
      }
    },
    [url, user?.token, props.year, props.month, props.date, addToast]
  );

  const mappedAttendanceDetails = userAttendances.map(
    (userAttendance, index) => {
      const userImage = isCloudFileSummary(userAttendance.image)
        ? userAttendance.image.url
        : "";

      const login =
        typeof userAttendance.attendance.login_time === "string"
          ? normalizeDate(userAttendance.attendance.login_time)
          : "-";

      const logout =
        typeof userAttendance.attendance.logout_time === "string"
          ? normalizeDate(userAttendance.attendance.logout_time)
          : "-";

      const late =
        userAttendance.attendance.late === null
          ? "-"
          : userAttendance.attendance.late
          ? "Yes"
          : "No";

      const absent = userAttendance.attendance.absent ? "Yes" : "No";

      return (
        <div
          key={index}
          className="w-full min-w-[768px] grid grid-cols-6 gap-4 border-b-[1px] p-4 *:flex *:flex-row *:items-center *:justify-start"
        >
          <div className="col-span-2  gap-2 flex flex-row items-center justify-start">
            <div
              style={{ backgroundImage: `url(${userImage})` }}
              className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-accent-purple bg-center bg-cover"
            />
            <p className=" truncate">
              {userAttendance.first_name} {userAttendance.last_name}
            </p>
          </div>
          <p className="break-words">{login}</p>
          <p className="break-words">{logout}</p>
          <p>{late}</p>
          <p>{absent}</p>
        </div>
      );
    }
  );

  React.useEffect(() => {
    const abort = new AbortController();

    getAttendanceDetails(abort);

    return () => {
      abort.abort();
    };
  }, [getAttendanceDetails]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
      p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-auto max-w-(--breakpoint-l-l) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "Attendance Details"}
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full h-full p-2 flex flex-col items-center justify-center overflow-x-auto t:p-4">
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
