import { UserInterface } from "@/src/interface/UserInterface";
import React from "react";
import { IoEllipsisVertical, IoMail, IoShieldCheckmark } from "react-icons/io5";

const EmployeeCard: React.FC<{
  employee: UserInterface;
  activeMenu: boolean;
  handleActiveMenu: () => void;
  sendMail: () => void;
}> = (props) => {
  return (
    <div
      key={props.employee.user_id}
      className="w-full p-4 rounded-md bg-neutral-100 flex flex-row items-start justify-start gap-4 relative"
    >
      <div className="w-12 h-12 min-w-12 min-h-12 bg-linear-to-b from-accent-yellow to-accent-blue rounded-full"></div>
      <div className="flex flex-col items-start justify-center gap-1 w-full overflow-hidden">
        <p
          title={`${props.employee.first_name} ${props.employee.last_name} `}
          className="font-bold truncate w-full"
        >
          {props.employee.first_name} {props.employee.last_name}
        </p>
        <p className="text-xs flex flex-row items-center justify-center gap-1">
          {props.employee.email_verified_at && (
            <IoShieldCheckmark
              className="text-accent-blue"
              title={`Verified at: ${props.employee.email_verified_at}`}
            />
          )}
          {props.employee.email}
        </p>
      </div>
      <button
        onClick={props.handleActiveMenu}
        className="p-2 text-xs hover:bg-neutral-200 rounded-full transition-all"
      >
        <IoEllipsisVertical
          className={`${
            props.activeMenu ? "text-accent-blue" : "text-neutral-900"
          }`}
        />
      </button>

      {props.activeMenu && (
        <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
          <button
            onClick={props.sendMail}
            className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
          >
            <IoMail className="text-accent-blue" />
            Mail
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;
