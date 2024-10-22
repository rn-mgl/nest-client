import InputString from "@/src/components/form/InputString";
import LogoDark from "@/src/components/global/LogoDark";
import React from "react";

const Register = () => {
  return (
    <div className="w-full flex flex-col items-center justify-start h-screen bg-neutral-200 p-4 l-s:p-8">
      <div
        className="w-full flex flex-col items-start justify-start h-full gap-8 l-s:items-start l-s:flex-row 
                max-w-screen-l-l rounded-lg t:shadow-lg t:p-4 bg-neutral-50"
      >
        <div
          className="w-full h-full flex flex-col items-start justify-start gap-8 t:mx-auto l-s:max-w-full
                    l-s:justify-start l-s:items-start"
        >
          <LogoDark />

          <div className="w-full flex flex-col items-start justify-center gap-8 max-w-screen-m-l t:justify-center t:mx-auto l-s:my-auto">
            <p className="font-bold text-2xl">Create your account</p>

            <form className="flex flex-col items-start justify-start w-full gap-4 ">
              <InputString
                id="first_name"
                placeholder="First Name"
                required={true}
                value=""
                type="text"
              />

              <InputString
                id="last_name"
                placeholder="Last Name"
                required={true}
                value=""
                type="text"
              />

              <InputString
                id="email"
                placeholder="E-Mail"
                required={true}
                value=""
                type="email"
              />

              <InputString
                id="password"
                placeholder="Password"
                required={true}
                value=""
                type="password"
              />

              <InputString
                id="password_confirmation"
                placeholder="Confirm Password"
                required={true}
                value=""
                type="password"
              />

              <button className="w-full font-bold text-center rounded-md p-2 bg-neutral-900 text-neutral-50 mt-2">
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className="hidden l-s:flex w-full h-full bg-accent-purple rounded-lg"></div>
      </div>
    </div>
  );
};

export default Register;
