import { ShowModal as ShowModalInterface } from "@/src/interface/ModalInterface";
import React from "react";
import { IoClose } from "react-icons/io5";

const ShowAttendance: React.FC<ShowModalInterface> = (props) => {
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
              <p>Time In</p>
              <p>Time Out</p>
              <p>Late</p>
              <p>Absent</p>
            </div>

            <div className="w-full h-full flex flex-col items-start justify-center">
              <div className="w-full min-w-[768px] grid grid-cols-6 gap-4 border-b-[1px] p-4 *:flex *:flex-row *:items-center *:justify-start">
                <div className="col-span-2  gap-2 flex flex-row items-center justify-start">
                  <div className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-accent-purple" />
                  <p className=" truncate">John Doe</p>
                </div>
                <p>Time In</p>
                <p>Time Out</p>
                <p>Late</p>
                <p>Absent</p>
              </div>

              <div className="w-full min-w-[768px] grid grid-cols-6 gap-4 p-4 *:flex *:flex-row *:items-center *:justify-start">
                <div className="col-span-2  gap-2 flex flex-row items-center justify-start">
                  <div className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-accent-purple" />
                  <p className=" truncate">John Doe</p>
                </div>
                <p>Time In</p>
                <p>Time Out</p>
                <p>Late</p>
                <p>Absent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowAttendance;
