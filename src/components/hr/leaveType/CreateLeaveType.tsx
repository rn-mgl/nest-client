import InputString from "@/components/form/InputString";
import { Modal as ModalInterface } from "@/interface/ModalInterface";
import { LeaveType as LeaveTypeInterface } from "@/src/interface/LeaveInterface";
import React from "react";
import { IoClose, IoOptions, IoReader } from "react-icons/io5";
import TextArea from "../../form/TextArea";
import { getCSRFToken } from "@/src/utils/token";
import useGlobalContext from "@/src/utils/context";
import { useSession } from "next-auth/react";
import axios from "axios";
import { getCookie } from "cookies-next";

const CreateLeaveType: React.FC<ModalInterface> = (props) => {
  const [leave, setLeave] = React.useState<LeaveTypeInterface>({
    type: "",
    description: "",
  });
  const { url } = useGlobalContext();
  const { data } = useSession({ required: true });
  const user = data?.user;

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

  const submitCreateLeaveType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken(url);

      if (token && user?.token) {
        const { data: createdLeave } = await axios.post(
          `${url}/hr/leave_type`,
          { ...leave },
          {
            headers: {
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
          }
        );
        if (createdLeave.success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }
          if (props.toggleModal) {
            props.toggleModal();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
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
          onSubmit={(e) => submitCreateLeaveType(e)}
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
            value={leave.description}
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

export default CreateLeaveType;