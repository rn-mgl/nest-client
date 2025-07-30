import { AlertInterface } from "@/src/interface/AlertInterface";
import React from "react";

const Alert: React.FC<AlertInterface> = (props) => {
  return (
    <div
      className="w-full h-full fixed top-0 left-0 z-60 bg-gradient-to-br from-accent-blue/30 to-accent-green/30 backdrop-blur-md
                animate-fade flex flex-col items-center justify-center p-4 t:p-8"
    >
      <div className="w-full flex flex-col items-center justify-center shadow-md max-w-(--breakpoint-m-l)">
        <div className="bg-white p-4 w-full rounded-lg flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-full flex flex-col items-center justify-center text-center gap-2">
            {props.icon ? (
              <div className="text-5xl text-accent-blue/30 drop-shadow-sm">
                {props.icon}
              </div>
            ) : null}
            <p className="font-bold text-xl">{props.title}</p>
            <p className="text-sm">{props.body}</p>
          </div>

          <div className="w-full flex flex-row items-center justify-center gap-2 mt-2">
            <button
              onClick={props.toggleAlert}
              className="w-full max-w-40 p-2 rounded-md bg-red-600 font-bold text-neutral-100"
            >
              No
            </button>

            <button
              onClick={props.confirmAlert}
              className="w-full max-w-40 p-2 rounded-md bg-accent-blue font-bold text-neutral-100"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
