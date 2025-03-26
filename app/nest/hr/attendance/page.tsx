"use client";

import Input from "@/src/components/form/Input";
import Select from "@/src/components/form/Select";
import ShowAttendance from "@/src/components/hr/attendance/ShowAttendance";
import { AttendanceStatisticsInterface } from "@/src/interface/AttendanceInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoArrowForward, IoCalendar } from "react-icons/io5";

const HRAttendance = () => {
  const [attendanceStatistics, setAttendanceStatistics] =
    React.useState<AttendanceStatisticsInterface>({
      ins: 0,
      outs: 0,
      lates: 0,
      absents: 0,
    });
  const [currentDate, setCurrentDate] = React.useState(new Date().getDate());
  const [currentYear, setCurrentYear] = React.useState<number | string>(
    new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = React.useState({
    label: new Date().toLocaleString("default", { month: "long" }),
    value: new Date().getMonth(),
  });
  const [activeSelect, setActiveSelect] = React.useState(false);
  const [activeSeeMore, setActiveSeeMore] = React.useState(0);

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
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

  const handleCurrentMonth = (month: number) => {
    setCurrentMonth({ value: month, label: monthOptions[month].label });
  };

  const handleActiveSelect = () => {
    setActiveSelect((prev) => !prev);
  };

  const handleCurrentYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCurrentYear(value === "" ? "" : Number(value));
  };

  const handleCurrentDate = (date: number) => {
    setCurrentDate(date);
  };

  const handleActiveSeeMore = (date: number) => {
    setActiveSeeMore((prev) => (date === prev ? 0 : date));
  };

  const getAttendanceStatistics = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: statistics } = await axios.get(`${url}/hr/attendance`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-CSRF-TOKEN": token,
          },
          withCredentials: true,
          params: {
            currentDate,
            currentMonth: currentMonth.value + 1,
            currentYear: Number(currentYear),
          },
        });

        if (statistics) {
          setAttendanceStatistics(statistics.attendances);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, currentDate, currentMonth, currentYear]);

  const startDay = getStartDayOfMonth(Number(currentYear), currentMonth.value);
  const daysInMonth = getDaysInMonth(Number(currentYear), currentMonth.value);
  const calendar = [];

  // before the start day of the month, set previous days as null
  // this is to align the days of the week
  for (let i = 0; i < startDay; i++) {
    calendar[i] = null;
  }

  // map the dates of the month in their respective days
  // daysInMonth + startDay to get the total days in the month
  for (let i = startDay, j = 1; i < daysInMonth + startDay; i++, j++) {
    calendar[i] = j;
  }

  const mappedDaysOfWeek = daysOfWeek.map((day, index) => {
    return (
      <div
        key={index}
        className="w-full h-fit aspect-square t:aspect-video border-2 
                  flex flex-col items-center justify-center rounded-sm t:rounded-md bg-neutral-200 font-semibold
                  text-xs t:text-sm"
      >
        {day}
      </div>
    );
  });

  const mappedCalendar = calendar.map((date, index) => {
    const selectedDate = currentDate === date;
    return selectedDate ? (
      <div
        key={index}
        className="w-full h-full aspect-square l-l:aspect-video flex flex-col 
              items-center justify-center rounded-sm t:rounded-md text-xs t:text-sm 
              bg-accent-blue text-accent-yellow border-0 font-bold animate-fade
              relative l-s:text-lg"
      >
        {date}

        <button
          onClick={() => handleActiveSeeMore(date)}
          className="absolute hidden bottom-2 t:flex text-xs font-light text-white gap-1 
                  items-center justify-center hover:border-b-[0.5px] transition-all"
        >
          See More <IoArrowForward />
        </button>
      </div>
    ) : (
      <button
        key={index}
        onClick={() => handleCurrentDate(Number(date))}
        disabled={date === null}
        className="w-full h-full aspect-square l-l:aspect-video border-2 flex flex-col bg-white 
                 items-center justify-center rounded-sm t:rounded-md text-xs t:text-sm l-s:text-lg"
      >
        {date}
      </button>
    );
  });

  React.useEffect(() => {
    getAttendanceStatistics();
  }, [getAttendanceStatistics]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {activeSeeMore ? (
        <ShowAttendance
          id={activeSeeMore}
          date={currentDate}
          month={currentMonth.value}
          year={Number(currentYear)}
          setActiveModal={handleActiveSeeMore}
        />
      ) : null}
      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <div
          className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
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

          <div className="w-full flex flex-col items-center justify-center t:hidden">
            <button
              onClick={() => handleActiveSeeMore(currentDate)}
              className="w-full p-2 rounded-md bg-accent-blue text-accent-yellow font-bold"
            >
              View Attendance Details
            </button>
          </div>

          <div className="w-full flex flex-row items-start justify-between gap-2">
            <div className="w-full aspect-video bg-accent-blue text-accent-yellow p-2 rounded-md flex flex-col items-center justify-center max-h-32">
              <p className="text-xs t:text-sm">Ins</p>
              <p className="text-xl t:text-3xl font-bold">
                {attendanceStatistics.ins}
              </p>
            </div>
            <div className="w-full aspect-video bg-accent-yellow text-neutral-900 p-2 rounded-md flex flex-col items-center justify-center max-h-32">
              <p className="text-xs t:text-sm">Outs</p>
              <p className="text-xl t:text-3xl font-bold">
                {attendanceStatistics.outs}
              </p>
            </div>
            <div className="w-full aspect-video  bg-accent-green text-neutral-900 p-2 rounded-md flex flex-col items-center justify-center max-h-32">
              <p className="text-xs t:text-sm">Lates</p>
              <p className="text-xl t:text-3xl font-bold">
                {attendanceStatistics.lates}
              </p>
            </div>
            <div className="w-full aspect-video  bg-accent-purple text-neutral-100 p-2 rounded-md flex flex-col items-center justify-center max-h-32">
              <p className="text-xs t:text-sm">Absents</p>
              <p className="text-xl t:text-3xl font-bold">
                {attendanceStatistics.absents}
              </p>
            </div>
          </div>

          <div className="w-full grid grid-cols-7 gap-1 t:gap-2">
            {mappedDaysOfWeek}
            {mappedCalendar}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRAttendance;
