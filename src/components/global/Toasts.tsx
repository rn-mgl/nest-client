"use client";

import { ToastInterface } from "@/src/interface/ToastInterface";
import React from "react";
import { IoCloseCircle } from "react-icons/io5";

const Toasts: React.FC<{
  toasts: ToastInterface[];
  clearToast: (id: number) => void;
}> = (props) => {
  const TYPE_COLOR = {
    info: {
      border: "#0084d1",
      background: "#b8e6fe",
    },
    warning: {
      border: "#d08700",
      background: "#fff085",
    },
    error: {
      border: "#e7000b",
      background: "#ffc9c9",
    },
    success: {
      border: "#00a63e",
      background: "#b9f8cf",
    },
  };

  const mappedToasts = props.toasts.map((toast, index) => {
    const currentTypeColor = TYPE_COLOR[toast.type];

    return (
      <div
        key={index}
        style={{
          background: currentTypeColor.background,
          borderColor: currentTypeColor.border,
        }}
        className="w-full p-2 border-2 rounded-md h-16 min-h-16 shadow-md flex flex-row items-start justify-center gap-2 animate-fade relative"
      >
        <div className="w-full">
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
        <button
          onClick={() => props.clearToast(toast.id)}
          style={{ color: currentTypeColor.border }}
          type="button"
        >
          <IoCloseCircle className="text-lg" />
        </button>
      </div>
    );
  });

  return (
    <div
      className="fixed top-0 z-60 flex flex-col items-center justify-center w-full p-2 t:p-4 t:max-w-(--breakpoint-m-l) 
                l-s:bottom-0 l-s:top-auto l-s:right-0"
    >
      <div className="flex flex-col items-center justify-start gap-2 l-s:flex-col-reverse w-full">
        {mappedToasts}
      </div>
    </div>
  );
};

export default Toasts;
