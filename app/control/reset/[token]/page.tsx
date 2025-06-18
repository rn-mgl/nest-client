"use client";
import React from "react";
import Logo from "@/src/components/global/Logo";
import Input from "@/src/components/form/Input";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import useShowPassword from "@/src/hooks/useShowPassword";

const Reset = () => {
  const [password, setPassword] = React.useState({
    new_password: "",
    new_password_confirmation: "",
  });

  const { showPassword, handleShowPassword } = useShowPassword();

  const url = process.env.URL;
  const params = useParams();
  const resetToken = params?.token ?? null;
  const router = useRouter();

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPassword((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token) {
        const { data: responseData } = await axios.patch(
          `${url}/admin_auth/reset-password`,
          { ...password, reset_token: resetToken },
          { headers: { "X-CSRF-TOKEN": token }, withCredentials: true }
        );
        if (responseData.success) {
          router.push("/control/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start h-screen bg-neutral-100 t:bg-neutral-200 p-4 l-s:p-8">
      <div
        className="w-full flex flex-col items-start justify-center h-full gap-8
            max-w-(--breakpoint-l-l) rounded-lg t:shadow-lg t:p-4 t:bg-neutral-50 relative"
      >
        <Logo url="/" type="dark" />

        <form
          onSubmit={(e) => submitResetPassword(e)}
          className="w-full h-full flex flex-col items-center justify-center gap-4 max-w-(--breakpoint-m-l) mx-auto"
        >
          <Input
            id="new_password"
            onChange={handlePassword}
            placeholder="New Password"
            required={true}
            type={showPassword.new_password ? "text" : "password"}
            value={password.new_password}
            icon={
              showPassword.new_password ? (
                <IoEyeOff
                  onClick={() => handleShowPassword("new_password")}
                  className="cursor-pointer"
                />
              ) : (
                <IoEye
                  onClick={() => handleShowPassword("new_password")}
                  className="cursor-pointer"
                />
              )
            }
            label={true}
          />

          <Input
            id="new_password_confirmation"
            onChange={handlePassword}
            placeholder="Confirm New Password"
            required={true}
            type={showPassword.new_password_confirmation ? "text" : "password"}
            value={password.new_password_confirmation}
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
            label={true}
          />

          <button className="w-full p-2 rounded-md bg-neutral-900 text-neutral-50 mt-2 font-bold">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reset;
