"use client";

import Input from "@/src/components/form/Input";
import Select from "@/src/components/form/Select";
import React from "react";
import { IoCalendar } from "react-icons/io5";

const HRAttendance = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date().getDate());
  const [currentYear, setCurrentYear] = React.useState(
    new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = React.useState({
    label: new Date().toLocaleString("default", { month: "long" }),
    value: new Date().getMonth(),
  });
  const [activeSelect, setActiveSelect] = React.useState(false);

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
    setCurrentYear(Number(value));
  };

  const handleCurrentDate = (date: number) => {
    setCurrentDate(date);
  };

  const startDay = getStartDayOfMonth(currentYear, currentMonth.value);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth.value);
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
    return (
      <button
        key={index}
        onClick={() => handleCurrentDate(Number(date))}
        className={`w-full h-full aspect-square l-l:aspect-video border-2 flex flex-col 
                  items-center justify-center rounded-sm t:rounded-md text-xs t:text-sm ${
                    date === currentDate &&
                    "bg-accent-blue text-accent-yellow border-0 font-bold"
                  }`}
      >
        {date}
      </button>
    );
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-screen-l-l p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <div
          className="w-full h-full flex flex-col items-center justify-start max-w-screen-l-l p-2
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
            />
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
