import React from "react";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { IoClose, IoOptions, IoReader } from "react-icons/io5";
import { LeaveTypeInterface } from "@/src/interface/LeaveInterface";
import { getCSRFToken } from "@/src/utils/token";
import { useSession } from "next-auth/react";
import axios from "axios";

import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";

const EditLeaveType: React.FC<ModalInterface> = (props) => {
  const [leaveType, setLeaveType] = React.useState<LeaveTypeInterface>({
    type: "",
    description: "",
  });
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

  const getLeaveType = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: leaveData } = await axios.get(
          `${url}/hr/leave_type/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
          }
        );

        setLeaveType(leaveData.leaveType);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const submitUpdateLeaveType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { token } = await getCSRFToken();

      if (token) {
        const { data: updatedLeave } = await axios.patch(
          `${url}/hr/leave_type/${props.id}`,
          { ...leaveType },
          {
            headers: {
              "X-CSRF-TOKEN": token,
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
          }
        );

        if (updatedLeave.success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }
          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getLeaveType();
  }, [getLeaveType]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
                p-4 t:p-8 z-50 bg-linear-to-b from-accent-yellow/30 to-accent-purple/30 animate-fade"
    >
      <div className="w-full h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-yellow rounded-t-lg font-bold text-accent-blue">
          Update Leave Type
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitUpdateLeaveType(e)}
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

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-yellow text-accent-blue mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditLeaveType;
