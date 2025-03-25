"use client";

import Input from "@/src/components/form/Input";
import Logo from "@/src/components/global/Logo";
import useShowPassword from "@/src/hooks/useShowPassword";
import { LoginInterface } from "@/src/interface/AuthInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { IoEye, IoEyeOff, IoMail } from "react-icons/io5";

const Login = () => {
  const [loginData, setLoginData] = React.useState<LoginInterface>({
    email: "",
    password: "",
  });

  const { showPassword, handleShowPassword } = useShowPassword();

  const url = process.env.URL;

  const router = useRouter();

  const handleLoginData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token) {
        const { data: login } = await axios.post(
          `${url}/auth/login`,
          { ...loginData },
          {
            headers: {
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
            withCredentials: true,
          }
        );

        if (login?.isVerified) {
          const data = await signIn("base-credentials", {
            token: login?.token,
            role: login.role,
            current: login?.current,
            redirect: false,
          });

          if (data?.ok) {
            const role = login?.role;
            router.push(`/nest/${role}`);
          }
        } else {
          router.push("/auth/sending?type=verification");
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
        <div className="hidden l-s:flex w-full h-full bg-accent-purple rounded-lg flex-col items-start justify-start p-4">
          <Logo url="/" type="dark" />
        </div>
        <div
          className="w-full h-full flex flex-col items-start justify-start gap-8 t:mx-auto l-s:max-w-full
                l-s:justify-start l-s:items-start"
        >
          <div className="l-s:hidden">
            <Logo url="/" type="dark" />
          </div>

          <div className="w-full flex flex-col items-start justify-center gap-8 max-w-(--breakpoint-m-l) t:justify-center t:mx-auto my-auto">
            <p className="font-bold text-2xl">Welcome back</p>

            <form
              onSubmit={(e) => submitLogin(e)}
              className="flex flex-col items-start justify-start w-full gap-4 "
            >
              <Input
                label={true}
                id="email"
                placeholder="E-Mail"
                required={true}
                value={loginData.email}
                type="email"
                onChange={handleLoginData}
                icon={<IoMail className="text-xl text-neutral-950" />}
              />

              <Input
                label={true}
                id="password"
                placeholder="Password"
                required={true}
                value={loginData.password}
                type={showPassword.password ? "text" : "password"}
                onChange={handleLoginData}
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

              <button className="w-full font-bold text-center rounded-md p-2 bg-neutral-900 text-neutral-50 mt-2">
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
