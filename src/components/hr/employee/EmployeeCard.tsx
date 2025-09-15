import { EmployeeCardInterface } from "@/src/interface/CardInterface";
import Image from "next/image";
import React from "react";
import { IoShieldCheckmark } from "react-icons/io5";

const EmployeeCard: React.FC<EmployeeCardInterface> = ({
  children,
  ...props
}) => {
  const hasProfilePicture =
    typeof props.user.image === "string" && props.user.image !== "";

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
          {typeof props.user.image === "string" && props.user.image !== "" ? (
            <Image
              src={props.user.image}
              className="absolute drop-shadow-md"
              alt="profile"
              width={300}
              height={300}
            />
          ) : null}
        </div>

        <div className="flex flex-col items-start justify-center gap-1 w-full overflow-hidden">
          <p
            title={`${props.user.first_name} ${props.user.last_name} `}
            className="font-bold truncate w-full"
          >
            {props.user.first_name} {props.user.last_name}
          </p>
          <button
            onClick={props.sendMail}
            title="Send Mail"
            className="text-xs flex flex-row items-center justify-center gap-1 hover:text-accent-blue hover:underline underline-offset-2 transition-all"
          >
            {props.user.email_verified_at && (
              <IoShieldCheckmark
                className="text-accent-blue"
                title={`Verified at: ${props.user.email_verified_at}`}
              />
            )}
            {props.user.email}
          </button>
        </div>
      </div>

      {children}
    </div>
  );
};

export default EmployeeCard;
