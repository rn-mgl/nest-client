"use client";

import Log from "@/src/components/employee/attendance/Log";
import Input from "@/src/components/form/Input";
import Select from "@/src/components/form/Select";
import { AttendanceInterface } from "@/src/interface/AttendanceInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { IoCalendar } from "react-icons/io5";

const Attendance = () => {
  const [canLog, setCanLog] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState({
    label: new Date().toLocaleDateString("default", { month: "long" }),
    value: new Date().getMonth(),
  });
  const [currentDate, setCurrentDate] = React.useState(new Date().getDate());
  const [currentYear, setCurrentYear] = React.useState(
    new Date().getFullYear()
  );
  const [activeSelect, setActiveSelect] = React.useState(false);
  const [logToday, setLogToday] = React.useState<AttendanceInterface>({});

  const { data } = useSession({ required: true });
  const user = data?.user;
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

  const handleCurrentMonth = (month: number) => {
    setCurrentMonth({ label: monthOptions[month].label, value: month });
  };

  const handleCurrentYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCurrentYear(Number(value));
  };

  const handleCurrentDate = (date: number) => {
    setCurrentDate(date);
  };

  const handleActiveSelect = () => {
    setActiveSelect((prev) => !prev);
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth.value);
  const startDay = getStartDayOfMonth(currentYear, currentMonth.value);
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
    return (
      <div
        key={index}
        className="w-full h-full aspect-square l-l:aspect-video flex flex-col 
          items-center justify-center rounded-sm t:rounded-md text-xs t:text-sm 
          bg-accent-blue text-accent-yellow border-0 font-bold animate-fade
          relative l-s:text-lg"
      >
        {date}
      </div>
    );
  });

  const getLogToday = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();
      const stringDate = `${currentYear}-${
        currentMonth.value + 1
      }-${currentDate}`;

      if (token && user?.token) {
        const { data: logToday } = await axios.get(
          `${url}/employee/attendance/${stringDate}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
            withCredentials: true,
          }
        );

        if (logToday.attendance) {
          setLogToday(logToday.attendance);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, currentYear, currentMonth, currentDate]);

  React.useEffect(() => {
    getLogToday();
  }, [getLogToday]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canLog ? (
        <Log
          id={logToday.attendance_id ?? 0}
          toggleModal={handleCanLog}
          logType={!logToday.login_time ? "in" : "out"}
          refetchIndex={getLogToday}
        />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-screen-l-l p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <div className="w-full flex flex-row items-start justify-between gap-2 t:gap-4 t:w-96 t:max-w-96 t:min-w-96">
          <Select
            id="month"
            options={monthOptions}
            placeholder="Month"
            value={currentMonth.value}
            onChange={handleCurrentMonth}
            required={false}
            icon={<IoCalendar />}
            label={currentMonth.label}
            activeSelect={activeSelect}
            toggleSelect={handleActiveSelect}
          />

          <Input
            id="year"
            placeholder="Year"
            required={false}
            type="number"
            value={currentYear}
            onChange={handleCurrentYear}
            icon={<IoCalendar />}
            min={2000}
          />
        </div>

        {!logToday.login_time || !logToday.logout_time ? (
          <button
            onClick={handleCanLog}
            className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                          gap-2 t:w-fit t:px-4 transition-all"
          >
            {!logToday.login_time ? "Log In" : "Log Out"}
            <IoCalendar className="text-lg" />
          </button>
        ) : (
          <p>Done</p>
        )}

        <div className="grid grid-cols-7 w-full gap-1 t:gap-2">
          {mappedDaysOfWeek}
          {mappedCalendar}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
