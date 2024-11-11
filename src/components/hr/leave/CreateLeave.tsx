import React from "react";
import { Modal as ModalInterface } from "@/interface/ModalInterface";
import { IoClose, IoOptions, IoReader, IoText } from "react-icons/io5";
import InputString from "@/components/form/InputString";
import { LeaveType as LeaveTypeInterface } from "@/src/interface/LeaveInterface";
import TextArea from "../../form/TextArea";

const CreateLeave: React.FC<ModalInterface> = (props) => {
  const [leave, setLeave] = React.useState<LeaveTypeInterface>({
    type: "",
    description: "",
  });

  const handleLeave = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setLeave((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
            p-4 t:p-8 z-50 bg-gradient-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade"
    >
      <div className="w-full h-auto max-w-screen-t bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-blue rounded-t-lg font-bold text-accent-yellow">
          Create Leave
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          //   onSubmit={(e) => submitCreateHR(e)}
          className="w-full h-full p-4 flex flex-col items-center justify-start gap-4"
        >
          <InputString
            label={true}
            id="type"
            onChange={handleLeave}
            placeholder="Type"
            required={true}
            type="text"
            value={leave.type}
            icon={<IoOptions />}
          />
          <TextArea
            label={true}
            id="description"
            onChange={handleLeave}
            placeholder="Description"
            required={true}
            value={leave.type}
            rows={10}
            icon={<IoReader />}
          />

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLeave;
