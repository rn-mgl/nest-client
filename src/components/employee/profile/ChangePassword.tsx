"use client";

import useShowPassword from "@/src/hooks/useShowPassword";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import Input from "@/src/components/global/form/Input";
import { useToasts } from "@/src/context/ToastContext";

const ChangePassword: React.FC<ModalInterface> = (props) => {
  const [password, setPassword] = React.useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const { showPassword, handleShowPassword } = useShowPassword();

  const { addToast } = useToasts();

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPassword((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.patch(
          `${url}/employee/auth/change-password`,
          { ...password },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          await signOut({ callbackUrl: "/auth/login", redirect: true });
        }
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the password is being updated.";
        addToast("Password Error", message, "error");
      }
    }
  };

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
                    p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade"
    >
      <div className="w-full h-auto max-w-(--breakpoint-t) bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-yellow rounded-t-lg font-bold text-accent-blue">
          Change Password
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitChangePassword(e)}
          className="p-2 flex flex-col items-center justify-center gap-4 t:p-4"
        >
          <Input
            id="current_password"
            name="current_password"
            onChange={handlePassword}
            placeholder="Current Password"
            required={true}
            type={showPassword.current_password ? "text" : "password"}
            value={password.current_password}
            label={true}
            icon={
              showPassword.current_password ? (
                <IoEyeOff
                  onClick={() => handleShowPassword("current_password")}
                  className="cursor-pointer"
                />
              ) : (
                <IoEye
                  onClick={() => handleShowPassword("current_password")}
                  className="cursor-pointer"
                />
              )
            }
          />

          <Input
            id="new_password"
            name="new_password"
            onChange={handlePassword}
            placeholder="New Password"
            required={true}
            type={showPassword.new_password ? "text" : "password"}
            value={password.new_password}
            label={true}
            icon={
              showPassword.new_password ? (
                <IoEyeOff
                  className="cursor-pointer"
                  onClick={() => handleShowPassword("new_password")}
                />
              ) : (
                <IoEye
                  className="cursor-pointer"
                  onClick={() => handleShowPassword("new_password")}
                />
              )
            }
          />

          <Input
            id="new_password_confirmation"
            name="new_password_confirmation"
            onChange={handlePassword}
            placeholder="New Password Confirmation"
            required={true}
            type={showPassword.new_password_confirmation ? "text" : "password"}
            value={password.new_password_confirmation}
            label={true}
            icon={
              showPassword.new_password_confirmation ? (
                <IoEyeOff
                  onClick={() =>
                    handleShowPassword("new_password_confirmation")
                  }
                  className="cursor-pointer"
                />
              ) : (
                <IoEye
                  onClick={() =>
                    handleShowPassword("new_password_confirmation")
                  }
                  className="cursor-pointer"
                />
              )
            }
          />

          <button className="w-full p-2 rounded-md bg-accent-yellow text-accent-blue font-bold mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
