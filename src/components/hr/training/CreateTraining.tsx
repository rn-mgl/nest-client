import { ModalInterface } from "@/src/interface/ModalInterface";
import React from "react";
import { IoClose } from "react-icons/io5";

const CreateTraining: React.FC<ModalInterface> = (props) => {
  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
            p-4 t:p-8 z-50 bg-gradient-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-auto max-w-screen-t bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-blue rounded-t-lg font-bold text-accent-yellow">
          Create Training
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          // onSubmit={(e) => submitCreatePerformanceReview(e)}
          className="w-full h-full p-4 flex flex-col items-center justify-start gap-4"
        ></form>
      </div>
    </div>
  );
};

export default CreateTraining;
