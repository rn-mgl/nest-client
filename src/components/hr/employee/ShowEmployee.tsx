"use client";

import { ModalInterface } from "@/src/interface/ModalInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { IoClose, IoMail } from "react-icons/io5";

const ShowEmployee: React.FC<ModalInterface> = (props) => {
  const [employee, setEmployee] = React.useState<UserInterface>({
    email: "",
    email_verified_at: "",
    first_name: "",
    last_name: "",
    user_id: 0,
    image: "",
  });

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const getEmployee = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/hr/employee/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.employee) {
          setEmployee(responseData.employee);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.token, url, props.id]);

  const sendMail = () => {
    location.href = `mailto:${employee.email}`;
  };

  React.useEffect(() => {
    getEmployee();
  }, [getEmployee]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
      p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-hidden"
    >
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "Employee Details"}
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full h-full p-4 flex flex-col items-center justify-start overflow-y-auto">
          {/* photo and header */}
          <div className="w-full p-2 rounded-md bg-gradient-to-br from-accent-blue/30 to-accent-purple/30 h-32 t:h-40 relative flex flex-col items-center justify-center">
            <div
              className={`absolute w-28 h-28 overflow-hidden rounded-full border-8 border-neutral-100 flex flex-col items-center justify-center
                        bottom-0 translate-y-2/4 ${
                          typeof employee.image === "string" &&
                          employee.image !== ""
                            ? "bg-accent-purple/30 backdrop-blur-lg"
                            : "bg-accent-purple"
                        }`}
            >
              {typeof employee.image === "string" && employee.image !== "" ? (
                <Image
                  src={employee.image}
                  alt="profile"
                  className="absolute"
                  width={300}
                  height={300}
                />
              ) : null}
            </div>
          </div>

          {/* name and email */}
          <div className="w-full p-2 flex flex-col items-center justify-center mt-14">
            <p className="font-bold text-lg l-l:text-2xl">
              {employee.first_name} {employee.last_name}
            </p>
            <button
              onClick={sendMail}
              className="text-accent-purple hover:underline underline-offset-2 gap-1 flex flex-row items-center justify-center text-sm l-l:text-base"
            >
              <IoMail /> <span>{employee.email}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowEmployee;
