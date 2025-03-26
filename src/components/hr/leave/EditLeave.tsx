import React from "react";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { IoClose, IoOptions, IoReader } from "react-icons/io5";
import { LeaveInterface } from "@/src/interface/LeaveInterface";
import { getCSRFToken } from "@/src/utils/token";
import { useSession } from "next-auth/react";
import axios from "axios";

import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";

const EditLeave: React.FC<ModalInterface> = (props) => {
  const [leave, setLeave] = React.useState<LeaveInterface>({
    type: "",
    description: "",
  });
  const url = process.env.URL;
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
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: leaveData } = await axios.get(
          `${url}/hr/leave_type/${props.id}`,
          {
            headers: {
              "X-CSRF-TOKEN": token,
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
      const { token } = await getCSRFToken();

      if (token) {
        const { data: updatedLeave } = await axios.patch(
          `${url}/hr/leave_type/${props.id}`,
          { ...leave },
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
    getLeave();
  }, [getLeave]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
                p-4 t:p-8 z-50 bg-linear-to-b from-accent-yellow/30 to-accent-purple/30 animate-fade"
    >
      <div className="w-full h-auto max-w-(--breakpoint-t) bg-neutral-100 shadow-md rounded-lg ">
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
          <Input
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

export default EditLeave;
