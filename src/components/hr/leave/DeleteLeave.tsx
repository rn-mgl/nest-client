import React from "react";
import { Modal as ModalInterface } from "@/src/interface/ModalInterface";
import { IoClose } from "react-icons/io5";

const DeleteLeave: React.FC<ModalInterface> = (props) => {
  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
                p-4 t:p-8 z-50 bg-gradient-to-b from-accent-yellow/30 to-accent-purple/30 animate-fade"
    >
      <div className="w-full h-auto max-w-screen-t bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-red-600 rounded-t-lg font-bold text-neutral-100">
          Delete Leave
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          //   onSubmit={(e) => submitCreateLeave(e)}
          className="w-full h-full p-4 flex flex-col items-center justify-start gap-4"
        >
          <button className="w-full font-bold text-center rounded-md p-2 bg-red-600 text-neutral-100 mt-2">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteLeave;
