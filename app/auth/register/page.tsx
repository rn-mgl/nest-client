"use client";

import Input from "@/src/components/form/Input";
import Logo from "@/src/components/global/Logo";
import useShowPassword from "@/src/hooks/useShowPassword";
import { RegisterInterface } from "@/src/interface/AuthInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useRouter } from "next/navigation";
import React from "react";
import { IoEye, IoEyeOff, IoMail, IoPersonCircle } from "react-icons/io5";

const Register = () => {
  const [registerData, setRegisterData] = React.useState<RegisterInterface>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const { showPassword, handleShowPassword } = useShowPassword();

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
          `${url}/auth/register`,
          { ...registerData, role: "employee" },
          {
            headers: { "X-CSRF-TOKEN": token },
            withCredentials: true,
          }
        );

        if (register.success) {
          route.push("/auth/sending?type=verification");
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
          <Logo url="/" type="dark" />

          <div className="w-full h-full flex flex-col items-start  gap-8 max-w-(--breakpoint-m-l) justify-center t:mx-auto l-s:my-auto pb-10">
            <p className="font-bold text-2xl">Create your account</p>

            <form
              onSubmit={(e) => submitRegister(e)}
              className="flex flex-col items-start justify-start w-full gap-4 "
            >
              <Input
                label={true}
                id="first_name"
                name="first_name"
                placeholder="First Name"
                required={true}
                value={registerData.first_name}
                type="text"
                onChange={handleRegisterData}
                icon={<IoPersonCircle className="text-xl text-neutral-950" />}
              />

              <Input
                label={true}
                id="last_name"
                name="last_name"
                placeholder="Last Name"
                required={true}
                value={registerData.last_name}
                type="text"
                onChange={handleRegisterData}
                icon={<IoPersonCircle className="text-xl text-neutral-950" />}
              />

              <Input
                label={true}
                id="email"
                name="email"
                placeholder="E-Mail"
                required={true}
                value={registerData.email}
                type="email"
                onChange={handleRegisterData}
                icon={<IoMail className="text-xl text-neutral-950" />}
              />

              <Input
                label={true}
                id="password"
                name="password"
                placeholder="Password"
                required={true}
                value={registerData.password}
                type={showPassword.password ? "text" : "password"}
                onChange={handleRegisterData}
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
                name="password_confirmation"
                placeholder="Confirm Password"
                required={true}
                value={registerData.password_confirmation}
                type={showPassword.password_confirmation ? "text" : "password"}
                onChange={handleRegisterData}
                icon={
                  showPassword.password_confirmation ? (
                    <IoEyeOff
                      onClick={() =>
                        handleShowPassword("password_confirmation")
                      }
                      className="text-xl text-neutral-950 cursor-pointer"
                    />
                  ) : (
                    <IoEye
                      onClick={() =>
                        handleShowPassword("password_confirmation")
                      }
                      className="text-xl text-neutral-950 cursor-pointer"
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

        <div className="hidden l-s:flex w-full h-full bg-accent-yellow rounded-lg"></div>
      </div>
    </div>
  );
};

export default Register;
