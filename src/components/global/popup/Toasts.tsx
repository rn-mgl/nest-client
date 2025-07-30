"use client";

import { ToastInterface } from "@/src/interface/ToastInterface";
import React from "react";
import {
  IoAlert,
  IoBulb,
  IoCheckmark,
  IoClose,
  IoWarning,
} from "react-icons/io5";

const Toasts: React.FC<{
  toasts: ToastInterface[];
  clearToast: (id: string) => void;
}> = (props) => {
  const TOAST_TYPE_STYLE = {
    info: {
      border: "#0084d1",
      background: "#b8e6fe",
      icon: <IoBulb />,
    },
    warning: {
      border: "#d08700",
      background: "#fff085",
      icon: <IoWarning />,
    },
    error: {
      border: "#e7000b",
      background: "#ffc9c9",
      icon: <IoAlert />,
    },
    success: {
      border: "#00a63e",
      background: "#b9f8cf",
      icon: <IoCheckmark />,
    },
  };

  const mappedToasts = props.toasts.map((toast, index) => {
    return (
      <div
        key={index}
        className="w-full p-2 border-2 rounded-sm shadow-md flex flex-row items-start justify-start gap-2 
                  animate-fade relative bg-white overflow-hidden transition-all"
      >
        <div className="w-full p-2 h-full min-h-20 max-h-40 overflow-y-auto">
          <div className="w-full flex flex-col items-start justify-start gap-2">
            <div className="text-sm font-bold flex flex-row items-center w-full justify-start gap-2">
              <p
                style={{
                  background: `${TOAST_TYPE_STYLE[toast.type].background}70`,
                }}
                className="min-w-6 w-6 min-h-6 h-6 rounded-full flex flex-col items-center justify-center"
              >
                {TOAST_TYPE_STYLE[toast.type].icon}
              </p>
              <p>{toast.subject}</p>
            </div>
            <p className="text-xs w-full">{toast.message}</p>
          </div>
        </div>

        <button onClick={() => props.clearToast(toast.id)} type="button">
          <IoClose className="text-sm text-neutral-400 " />
        </button>

        <div
          style={{ background: `${TOAST_TYPE_STYLE[toast.type].background}70` }}
          className="absolute bottom-0 w-full left-0 h-1 "
        >
          <div
            style={{
              width: `${toast.percentage}%`,
              background: TOAST_TYPE_STYLE[toast.type].border,
            }}
            className="h-full transition-all"
          />
        </div>
      </div>
    );
  });

  return (
    <div
      className="fixed top-0 z-70 flex flex-col items-center justify-center w-full p-2 t:p-4 t:max-w-(--breakpoint-m-l) 
                l-s:bottom-0 l-s:top-auto l-s:right-0"
    >
      <div className="flex flex-col items-center justify-start gap-2 l-s:flex-col-reverse w-full">
        {mappedToasts}
      </div>
    </div>
  );
};

export default Toasts;
