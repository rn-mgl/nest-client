"use client";

import Input from "@/src/components/form/Input";
import Logo from "@/src/components/global/Logo";
import useShowPassword from "@/src/hooks/useShowPassword";
import { RegisterInterface } from "@/src/interface/AuthInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React from "react";
import { IoEye, IoEyeOff, IoMail, IoPersonCircle } from "react-icons/io5";

const Register = () => {
  const { showPassword, handleShowPassword } = useShowPassword();
  const [registerData, setRegisterData] = React.useState<RegisterInterface>({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirmation: "",
  });

  const url = process.env.URL;
  const route = useRouter();

  const handleRegisterData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setRegisterData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token) {
        const { data: register } = await axios.post(
          `${url}/admin_auth/register`,
          { ...registerData },
          {
            headers: { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") },
            withCredentials: true,
          }
        );

        if (register.success) {
          route.push("/control/sending?type=verification");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start h-screen bg-neutral-100 t:bg-neutral-200 p-4 l-s:p-8">
      <div
        className="w-full flex flex-col items-start justify-start h-full gap-8 l-s:items-start l-s:flex-row 
                max-w-(--breakpoint-l-l) rounded-lg t:shadow-lg t:p-4 t:bg-neutral-50"
      >
        <div
          className="w-full h-full flex flex-col items-start justify-start gap-8 t:mx-auto l-s:max-w-full
                    l-s:justify-start l-s:items-start"
        >
          <Logo type="dark" url="/" />

          <div className="w-full h-full flex flex-col items-start  gap-8 max-w-(--breakpoint-m-l) justify-center t:mx-auto l-s:my-auto pb-10">
            <p className="font-bold text-2xl">Create Admin account</p>

            <form
              onSubmit={(e) => submitRegister(e)}
              className="flex flex-col items-start justify-start w-full gap-4 "
            >
              <Input
                id="first_name"
                placeholder="First Name"
                required={true}
                type="text"
                value={registerData.first_name}
                onChange={handleRegisterData}
                icon={<IoPersonCircle className="text-xl text-neutral-950" />}
              />

              <Input
                id="last_name"
                placeholder="Last Name"
                required={true}
                type="text"
                value={registerData.last_name}
                onChange={handleRegisterData}
                icon={<IoPersonCircle className="text-xl text-neutral-950" />}
              />

              <Input
                id="email"
                placeholder="E-Mail"
                required={true}
                type="email"
                value={registerData.email}
                onChange={handleRegisterData}
                icon={<IoMail className="text-xl text-neutral-950" />}
              />

              <Input
                id="password"
                placeholder="Password"
                required={true}
                type={showPassword.password ? "text" : "password"}
                value={registerData.password}
                onChange={handleRegisterData}
                icon={
                  showPassword.password ? (
                    <IoEyeOff
                      onClick={() => handleShowPassword("password")}
                      className="text-xl text-neutral-950"
                    />
                  ) : (
                    <IoEye
                      onClick={() => handleShowPassword("password")}
                      className="text-xl text-neutral-950"
                    />
                  )
                }
              />

              <Input
                id="password_confirmation"
                placeholder="Confirm Password"
                required={true}
                type={showPassword.password_confirmation ? "text" : "password"}
                value={registerData.password_confirmation}
                onChange={handleRegisterData}
                icon={
                  showPassword.password_confirmation ? (
                    <IoEyeOff
                      onClick={() =>
                        handleShowPassword("password_confirmation")
                      }
                      className="text-xl text-neutral-950"
                    />
                  ) : (
                    <IoEye
                      onClick={() =>
                        handleShowPassword("password_confirmation")
                      }
                      className="text-xl text-neutral-950"
                    />
                  )
                }
              />

              <button className="w-full font-bold text-center rounded-md p-2 bg-neutral-900 text-neutral-50 mt-2">
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className="hidden l-s:flex w-full h-full bg-linear-to-b from-accent-blue to-accent-yellow rounded-lg"></div>
      </div>
    </div>
  );
};

export default Register;
