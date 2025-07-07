import { CardInterface } from "@/src/interface/CardInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import Image from "next/image";
import React from "react";
import {
  IoArrowForward,
  IoEllipsisVertical,
  IoMail,
  IoShieldCheckmark,
} from "react-icons/io5";

const EmployeeCard: React.FC<
  CardInterface & UserInterface & { sendMail: () => void }
> = (props) => {
  const hasProfilePicture =
    typeof props.image === "string" && props.image !== "";

  return (
    <div className="w-full p-4 rounded-md bg-neutral-100 flex flex-col items-center justify-center gap-4">
      <div className="w-full flex flex-row items-start justify-start gap-4 relative">
        <div
          className={`w-12 h-12 min-w-12 min-h-12 bg-linear-to-b rounded-full
                  bg-center bg-cover relative flex flex-col items-center justify-center overflow-hidden ${
                    hasProfilePicture
                      ? "from-accent-yellow/30 to-accent-blue/30"
                      : "from-accent-yellow to-accent-blue"
                  } `}
        >
          {typeof props.image === "string" && props.image !== "" ? (
            <Image
              src={props.image}
              className="absolute drop-shadow-md"
              alt="profile"
              width={300}
              height={300}
            />
          ) : null}
        </div>

        <div className="flex flex-col items-start justify-center gap-1 w-full overflow-hidden">
          <p
            title={`${props.first_name} ${props.last_name} `}
            className="font-bold truncate w-full"
          >
            {props.first_name} {props.last_name}
          </p>
          <p className="text-xs flex flex-row items-center justify-center gap-1">
            {props.email_verified_at && (
              <IoShieldCheckmark
                className="text-accent-blue"
                title={`Verified at: ${props.email_verified_at}`}
              />
            )}
            {props.email}
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
          <div className="w-32 p-2 rounded-md top-0 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
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

      <button
        onClick={props.handleActiveSeeMore}
        className="w-full p-2 rounded-md bg-accent-blue text-neutral-100 text-xs 
              flex flex-row items-center justify-center gap-2"
      >
        <span>See More</span>
        <IoArrowForward />
      </button>
    </div>
  );
};

export default EmployeeCard;
