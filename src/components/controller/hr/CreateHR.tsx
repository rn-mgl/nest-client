"use client";
import React from "react";
import { IoClose, IoEye, IoEyeOff, IoMail, IoPeople } from "react-icons/io5";
import { RegisterInterface } from "@/src/interface/AuthInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import Input from "@/components/form/Input";
import useShowPassword from "@/src/hooks/useShowPassword";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";

const CreateHR: React.FC<ModalInterface> = (props) => {
  const [credentials, setCredentials] = React.useState<RegisterInterface>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirmation: "",
  });
  const { showPassword, handleShowPassword } = useShowPassword();
  const { data } = useSession({ required: true });
  const user = data?.user;

  const url = process.env.URL;

  const handleCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCredentials((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitCreateHR = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: createHR } = await axios.post(
          `${url}/admin/hr/register`,
          { ...credentials, role: "hr" },
          {
            headers: {
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
          }
        );

        if (createHR.success) {
          if (props.refetchIndex !== undefined) {
            props.refetchIndex();
          }
          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
                p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade"
    >
      <div className="w-full h-auto max-w-(--breakpoint-t) bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-blue rounded-t-lg font-bold text-accent-yellow">
          Create HR
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>

        <form
          onSubmit={(e) => submitCreateHR(e)}
          className="w-full h-full p-4 flex flex-col items-center justify-start gap-4"
        >
          <Input
            label={true}
            id="first_name"
            onChange={handleCredentials}
            placeholder="First Name"
            required={true}
            type="text"
            value={credentials.first_name}
            icon={<IoPeople />}
          />

          <Input
            label={true}
            id="last_name"
            onChange={handleCredentials}
            placeholder="Last Name"
            required={true}
            type="text"
            value={credentials.last_name}
            icon={<IoPeople />}
          />

          <Input
            label={true}
            id="email"
            onChange={handleCredentials}
            placeholder="Email"
            required={true}
            type="email"
            value={credentials.email}
            icon={<IoMail />}
          />

          <Input
            label={true}
            id="password"
            onChange={handleCredentials}
            placeholder="Password"
            required={true}
            type={showPassword.password ? "text" : "password"}
            value={credentials.password}
            icon={
              showPassword.password ? (
                <IoEyeOff
                  onClick={() => handleShowPassword("password")}
                  className="text-xl text-neutral-950 cursor-pointer"
                />
              ) : (
                <IoEye
                  onClick={() => handleShowPassword("password")}
                  className="text-xl text-neutral-950 cursor-pointer"
                />
              )
            }
          />

          <Input
            label={true}
            id="password_confirmation"
            onChange={handleCredentials}
            placeholder="Confirm Password"
            required={true}
            type={showPassword.password_confirmation ? "text" : "password"}
            value={credentials.password_confirmation}
            icon={
              showPassword.password_confirmation ? (
                <IoEyeOff
                  onClick={() => handleShowPassword("password_confirmation")}
                  className="text-xl text-neutral-950 cursor-pointer"
                />
              ) : (
                <IoEye
                  onClick={() => handleShowPassword("password_confirmation")}
                  className="text-xl text-neutral-950 cursor-pointer"
                />
              )
            }
          />

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateHR;
