import React from "react";
import {
  Modal as ModalInterface,
  UpdateModal as UpdateModalInterface,
} from "@/src/interface/ModalInterface";
import { IoClose, IoOptions, IoReader } from "react-icons/io5";
import { LeaveType as LeaveTypeInterface } from "@/src/interface/LeaveInterface";
import { getCSRFToken } from "@/src/utils/token";
import useGlobalContext from "@/src/utils/context";
import { useSession } from "next-auth/react";
import axios from "axios";
import { getCookie } from "cookies-next";
import InputString from "../../form/InputString";
import TextArea from "../../form/TextArea";

const EditLeaveType: React.FC<ModalInterface & UpdateModalInterface> = (
  props
) => {
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

  const getLeave = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken(url);

      if (token && user?.token) {
        const { data: leaveData } = await axios.get(
          `${url}/hr/leave_type/${props.id}`,
          {
            headers: {
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
          }
        );

        setLeave(leaveData.leave);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const submitUpdateLeave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { token } = await getCSRFToken(url);

      if (token) {
        const { data: updatedLeave } = await axios.patch(
          `${url}/hr/leave_type/${props.id}`,
          { ...leave },
          {
            headers: {
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
          }
        );

        if (updatedLeave.success) {
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

  React.useEffect(() => {
    getLeave();
  }, [getLeave]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
                p-4 t:p-8 z-50 bg-gradient-to-b from-accent-yellow/30 to-accent-purple/30 animate-fade"
    >
      <div className="w-full h-auto max-w-screen-t bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-yellow rounded-t-lg font-bold text-accent-blue">
          Update Leave
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitUpdateLeave(e)}
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

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-yellow text-accent-blue mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditLeaveType;
