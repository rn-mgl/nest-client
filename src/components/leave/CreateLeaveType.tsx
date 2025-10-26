import Input from "@/src/components/global/form/Input";
import { ModalInterface } from "@/interface/ModalInterface";
import { LeaveTypeInterface } from "@/src/interface/LeaveInterface";
import React from "react";
import { IoClose, IoOptions, IoReader } from "react-icons/io5";
import TextArea from "@/src/components/global/form/TextArea";
import { getCSRFToken } from "@/src/utils/token";
import { useSession } from "next-auth/react";
import axios, { isAxiosError } from "axios";
import { useToasts } from "@/src/context/ToastContext";

const CreateLeaveType: React.FC<ModalInterface> = (props) => {
  const [leaveType, setLeaveType] = React.useState<LeaveTypeInterface>({
    type: "",
    description: "",
    created_by: 0,
  });
  const { addToast } = useToasts();
  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleLeaveType = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setLeaveType((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitCreateLeaveType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: createdLeave } = await axios.post(
          `${url}/leave-type/resource`,
          { ...leaveType },
          {
            headers: {
              "X-CSRF-TOKEN": token,
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
          }
        );
        if (createdLeave.success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }
          addToast(
            "Leave Type Created",
            `${leaveType.type} as been created.`,
            "success"
          );
          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the leave types is being created";
        addToast("Leave Type Error", message, "error");
      }
    }
  };

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
            p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade"
    >
      <div className="w-full h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col">
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
          className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 t:p-4"
        >
          <Input
            label={true}
            id="type"
            name="type"
            onChange={handleLeaveType}
            placeholder="Type"
            required={true}
            type="text"
            value={leaveType.type}
            icon={<IoOptions />}
          />
          <TextArea
            label={true}
            id="description"
            name="description"
            onChange={handleLeaveType}
            placeholder="Description"
            required={true}
            value={leaveType.description}
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
