"use client";

import Log from "@/src/components/employee/attendance/Log";
import Input from "@/src/components/form/Input";
import Select from "@/src/components/form/Select";
import Toasts from "@/src/components/global/popup/Toasts";
import { useToasts } from "@/src/context/ToastContext";
import useIsLoading from "@/src/hooks/useIsLoading";
import { AttendanceInterface } from "@/src/interface/AttendanceInterface";
import axios from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoCalendar } from "react-icons/io5";

const Attendance = () => {
  const [canLog, setCanLog] = React.useState(false);
  const [activeMonth, setActiveMonth] = React.useState({
    label: new Date().toLocaleDateString("default", { month: "long" }),
    value: new Date().getMonth(),
  });
  const [activeDate, setActiveDate] = React.useState(new Date().getDate());
  const [activeYear, setActiveYear] = React.useState(new Date().getFullYear());
  const [activeSelect, setActiveSelect] = React.useState(false);

  const [attendance, setAttendance] = React.useState<AttendanceInterface>({
    absent: false,
    late: false,
    login_time: "-",
    logout_time: "-",
  });

  const { toasts, clearToast } = useToasts();
  const { isLoading, handleIsLoading } = useIsLoading(true);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();

  const activeDateEqualToCurrentDate =
    currentDate === activeDate &&
    currentMonth === activeMonth.value &&
    currentYear === activeYear;

  const activeDateGreaterThanCurrentDate =
    (activeDate > currentDate &&
      (activeMonth.value >= currentMonth || activeYear >= currentYear)) ||
    activeMonth.value > currentMonth ||
    activeYear > currentYear;

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const daysOfTheWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const monthOptions = [
    { label: "January", value: 0 },
    { label: "February", value: 1 },
    { label: "March", value: 2 },
    { label: "April", value: 3 },
    { label: "May", value: 4 },
    { label: "June", value: 5 },
    { label: "July", value: 6 },
    { label: "August", value: 7 },
    { label: "September", value: 8 },
    { label: "October", value: 9 },
    { label: "November", value: 10 },
    { label: "December", value: 11 },
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getStartDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleCanLog = () => {
    setCanLog((prev) => !prev);
  };

  const handleActiveMonth = (month: number, label: string) => {
    setActiveMonth({ label: label, value: month });
  };

  const handleActiveYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setActiveYear(Number(value));
  };

  const handleActiveDate = (date: number) => {
    setActiveDate(date);
  };

  const handleActiveSelect = () => {
    setActiveSelect((prev) => !prev);
  };

  const daysInMonth = getDaysInMonth(activeYear, activeMonth.value);
  const startDay = getStartDayOfMonth(activeYear, activeMonth.value);
  const calendar = [];

  for (let i = 0; i < startDay; i++) {
    calendar[i] = null;
  }

  for (let i = startDay, j = 1; j < daysInMonth; j++, i++) {
    calendar[i] = j;
  }

  const mappedDaysOfWeek = daysOfTheWeek.map((date, index) => {
    return (
      <div
        key={index}
        className="w-full h-fit aspect-square t:aspect-video border-2 
                  flex flex-col items-center justify-center rounded-sm t:rounded-md bg-neutral-200 font-semibold
                  text-xs t:text-sm"
      >
        {date}
      </div>
    );
  });

  const mappedCalendar = calendar.map((date, index) => {
    return date === activeDate ? (
      <div
        key={index}
        className={`w-full h-full aspect-square l-l:aspect-video flex flex-col 
          items-center justify-center rounded-sm t:rounded-md text-xs t:text-sm 
          border-accent-blue border-2 bg-accent-blue text-accent-yellow font-bold animate-fade
          relative l-s:text-lg`}
      >
        {date}
      </div>
    ) : date === null ? (
      <div
        key={index}
        className={`w-full h-full aspect-square l-l:aspect-video flex flex-col 
        items-center justify-center rounded-sm t:rounded-md text-xs t:text-sm 
        border-2 font-bold animate-fade
        relative l-s:text-lg`}
      />
    ) : (
      <button
        key={index}
        onClick={() => handleActiveDate(date)}
        className={`w-full h-full aspect-square l-l:aspect-video flex flex-col 
        items-center justify-center rounded-sm t:rounded-md text-xs t:text-sm 
        border-2 animate-fade relative l-s:text-lg hover:bg-neutral-100 ${
          date === currentDate &&
          currentMonth === activeMonth.value &&
          currentYear === activeYear
            ? "border-accent-blue/50"
            : ""
        }`}
      >
        {date}
      </button>
    );
  });

  const getAttendance = React.useCallback(async () => {
    if (activeDateGreaterThanCurrentDate) return;

    handleIsLoading(true);

    try {
      const stringDate = `${activeYear}-${activeMonth.value + 1}-${activeDate}`;

      if (user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/attendance/${stringDate}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
          }
        );

        if (responseData.attendance) {
          setAttendance(responseData.attendance);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleIsLoading(false);
    }
  }, [
    url,
    user?.token,
    activeYear,
    activeMonth,
    activeDate,
    activeDateGreaterThanCurrentDate,
    handleIsLoading,
  ]);

  React.useEffect(() => {
    getAttendance();
  }, [getAttendance]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {toasts.length ? (
        <Toasts toasts={toasts} clearToast={clearToast} />
      ) : null}

      {canLog ? (
        <Log
          id={attendance.attendance_id ?? 0}
          toggleModal={handleCanLog}
          refetchIndex={getAttendance}
        />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <div className="flex flex-col w-full items-center justify-center gap-4 t:gap-8 t:flex-row t:justify-between">
          <div className="w-full flex flex-row items-start justify-between gap-2 t:gap-4 t:w-96 t:max-w-96 t:min-w-96">
            <Select
              id="month"
              name="month"
              options={monthOptions}
              placeholder="Month"
              value={activeMonth.value}
              onChange={handleActiveMonth}
              required={false}
              icon={<IoCalendar />}
              label={activeMonth.label}
              activeSelect={activeSelect}
              toggleSelect={handleActiveSelect}
            />

            <Input
              id="year"
              name="year"
              placeholder="Year"
              required={false}
              type="number"
              value={activeYear}
              onChange={handleActiveYear}
              icon={<IoCalendar />}
              min={2000}
            />
          </div>

          {activeDateEqualToCurrentDate &&
            !isLoading &&
            (!attendance.login_time ? (
              <button
                onClick={handleCanLog}
                className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                          gap-2 t:w-fit t:px-4 transition-all"
              >
                Log In
                <IoCalendar className="text-lg" />
              </button>
            ) : !attendance.logout_time ? (
              <button
                onClick={handleCanLog}
                className="bg-red-600 text-white w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                          gap-2 t:w-fit t:px-4 transition-all"
              >
                Log Out
                <IoCalendar className="text-lg" />
              </button>
            ) : (
              <div
                className="w-full flex flex-col items-center justify-center p-2 rounded-md 
                      text-accent-blue border-accent-blue border-2 font-bold t:w-fit t:px-4"
              >
                <p>Attendance Completed</p>
              </div>
            ))}
        </div>

        <div className="w-full flex flex-col items-center justify-center text-xs t:text-sm">
          <div
            className="w-full grid grid-cols-4 items-center justify-center *:flex *:flex-col *:items-center 
                      *:justify-center bg-neutral-200 p-2 rounded-t-sm font-bold t:rounded-t-md t:p-4"
          >
            <p>Log In</p>
            <p>Log Out</p>
            <p>Late</p>
            <p>Absent</p>
          </div>

          <div
            className="w-full grid grid-cols-4 items-center justify-center *:flex *:flex-col *:items-center 
                      *:justify-center bg-white p-2 rounded-b-sm border-[1px] border-t-0 *:text-center t:rounded-b-md t:p-4"
          >
            <p>{attendance.login_time ?? "-"}</p>
            <p>{attendance.logout_time ?? "-"}</p>
            <p>{attendance.absent ? "-" : attendance.late ? "Yes" : "No"}</p>
            <p>{attendance.absent ? "Yes" : "No"}</p>
          </div>
        </div>

        <div className="grid grid-cols-7 w-full gap-1 t:gap-2">
          {mappedDaysOfWeek}
          {mappedCalendar}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
