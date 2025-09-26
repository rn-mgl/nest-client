"use client";

import Log from "@/src/components/employee/attendance/Log";
import Input from "@/src/components/form/Input";
import Select from "@/src/components/form/Select";
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
  const [activeYear, setActiveYear] = React.useState<number | string>(
    new Date().getFullYear()
  );
  const [activeSelect, setActiveSelect] = React.useState(false);

  const [attendance, setAttendance] =
    React.useState<AttendanceInterface | null>(null);

  const { isLoading, handleIsLoading } = useIsLoading(true);

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const today = React.useMemo(() => {
    const d = new Date();

    return {
      date: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
    };
  }, []);

  const activeDateEqualToCurrentDate = React.useMemo(() => {
    return (
      activeDate === today.date &&
      activeMonth.value === today.month &&
      activeYear === today.year
    );
  }, [
    today.date,
    today.month,
    today.year,
    activeDate,
    activeMonth,
    activeYear,
  ]);

  const activeDateGreaterThanCurrentDate = React.useMemo(() => {
    return (
      (activeDate > today.date &&
        (activeMonth.value >= today.month ||
          Number(activeYear) >= today.year)) ||
      activeMonth.value > today.month ||
      Number(activeYear) > today.year
    );
  }, [
    today.date,
    today.month,
    today.year,
    activeDate,
    activeMonth,
    activeYear,
  ]);

  const daysOfTheWeek = React.useMemo(
    () => ["S", "M", "T", "W", "T", "F", "S"],
    []
  );
  const monthOptions = React.useMemo(
    () => [
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
    ],
    []
  );

  const daysInMonth = React.useMemo(
    () => new Date(Number(activeYear), activeMonth.value + 1, 0).getDate(),
    [activeYear, activeMonth.value]
  );

  const startDay = React.useMemo(
    () => new Date(Number(activeYear), activeMonth.value, 1).getDay(),
    [activeYear, activeMonth.value]
  );

  const handleCanLog = () => {
    setCanLog((prev) => !prev);
  };

  const handleActiveMonth = (month: number, label: string) => {
    setActiveMonth({ label: label, value: month });
  };

  const handleActiveYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setActiveYear(value === "" ? "" : Number(value));
  };

  const handleActiveDate = (date: number) => {
    setActiveDate(date);
  };

  const handleActiveSelect = () => {
    setActiveSelect((prev) => !prev);
  };

  const calendar = Array(startDay).fill(null);

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
          date === today.date &&
          today.month === activeMonth.value &&
          today.year === activeYear
            ? "border-accent-blue/50"
            : ""
        }`}
      >
        {date}
      </button>
    );
  });

  const getAttendance = React.useCallback(
    async (abort?: AbortController) => {
      handleIsLoading(true);

      setAttendance(null);

      if (activeDateGreaterThanCurrentDate) {
        return;
      }

      try {
        const stringDate = `${activeYear}-${
          activeMonth.value + 1
        }-${activeDate}`;

        if (user?.token) {
          const { data: responseData } = await axios.get<{
            attendance: AttendanceInterface;
          }>(`${url}/employee/attendance/${stringDate}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            signal: abort?.signal,
            withCredentials: true,
          });

          if (responseData.attendance) {
            setAttendance(responseData.attendance);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        handleIsLoading(false);
      }
    },
    [
      url,
      user?.token,
      activeYear,
      activeMonth,
      activeDate,
      activeDateGreaterThanCurrentDate,
      handleIsLoading,
    ]
  );

  React.useEffect(() => {
    const controller = new AbortController();

    getAttendance(controller);

    return () => controller.abort();
  }, [getAttendance]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canLog ? (
        <Log
          id={attendance?.id ?? 0}
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

          {!isLoading && attendance && activeDateEqualToCurrentDate ? (
            !attendance?.login_time ? (
              <button
                onClick={handleCanLog}
                className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                          gap-2 t:w-fit t:px-4 transition-all"
              >
                Log In
                <IoCalendar className="text-lg" />
              </button>
            ) : !attendance?.logout_time ? (
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
                Attendance Completed
              </div>
            )
          ) : null}
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
            <p>{attendance?.login_time ?? "-"}</p>
            <p>{attendance?.logout_time ?? "-"}</p>
            <p>{attendance?.absent ? "-" : attendance?.late ? "Yes" : "No"}</p>
            <p>{attendance?.absent ? "Yes" : "No"}</p>
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
