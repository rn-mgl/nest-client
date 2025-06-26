"use client";

import { ToastInterface } from "@/src/interface/ToastInterface";
import React from "react";
import { IoCloseCircle } from "react-icons/io5";

const Toast: React.FC<{
  toasts: ToastInterface[];
  clearToast: (index: number) => void;
}> = (props) => {
  const TYPE_COLOR = {
    info: {
      background: "#0084d1",
      color: "#b8e6fe",
      border: "#024a70",
    },
    warning: {
      background: "#d08700",
      color: "#fff085",
      border: "#733e0a",
    },
    error: {
      background: "#e7000b",
      color: "#ffc9c9",
      border: "#82181a",
    },
    success: {
      background: "#00a63e",
      color: "#b9f8cf",
      border: "#0d542b",
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
        className="w-full p-2 border-4 rounded-md h-16 min-h-16 shadow-md flex flex-row items-start justify-center gap-2"
      >
        <div>
          <p style={{ color: currentTypeColor.color }} className="text-sm">
            {toast.message}
          </p>
        </div>
        <button style={{ color: currentTypeColor.border }} type="button">
          <IoCloseCircle className="text-lg" />
        </button>
      </div>
    );
  });

  return (
    <div className="fixed top-0 z-60 flex flex-col items-center justify-center w-full p-2 t:p-4 t:max-w-(--breakpoint-m-l)">
      <div className="flex flex-col items-center justify-start gap-2">
        {mappedToasts}
      </div>
    </div>
  );
};

export default Toast;
