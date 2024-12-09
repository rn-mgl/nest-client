import React from "react";
import { Modal as ModalInterface } from "@/src/interface/ModalInterface";
import { IoClose } from "react-icons/io5";

const ShowOnboarding: React.FC<ModalInterface> = (props) => {
  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
    p-4 t:p-8 z-50 bg-gradient-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto"
    >
      <div className="w-full my-auto h-auto max-w-screen-t bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-blue rounded-t-lg font-bold text-accent-yellow">
          Show Onboarding
          <button
            onClick={() => props.setActiveModal && props.setActiveModal(0)}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full h-full p-4 flex flex-col items-center justify-start gap-4"></div>
      </div>
    </div>
  );
};

export default ShowOnboarding;
