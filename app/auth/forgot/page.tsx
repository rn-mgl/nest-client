"use client";

import Input from "@/src/components/form/Input";
import Logo from "@/components/global/navigation/Logo";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import React from "react";
import { IoMail } from "react-icons/io5";

const Forgot = () => {
  const [candidate, setCandidate] = React.useState({
    email: "",
  });

  const url = process.env.URL;

  const handleCandidate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCandidate((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const { token } = await getCSRFToken();

      if (token) {
        const { data: responseData } = await axios.post(
          `${url}/auth/forgot-password`,
          { ...candidate },
          { headers: { "X-CSRF-TOKEN": token }, withCredentials: true }
        );

        if (responseData.success) {
          console.log(responseData);
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
          onSubmit={(e) => submitForgotPassword(e)}
          className="w-full h-full flex flex-col items-center justify-center gap-4 max-w-(--breakpoint-m-l) mx-auto"
        >
          <Input
            id="email"
            name="email"
            onChange={handleCandidate}
            placeholder="E-Mail"
            required={true}
            type="email"
            value={candidate.email}
            icon={<IoMail />}
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

export default Forgot;
