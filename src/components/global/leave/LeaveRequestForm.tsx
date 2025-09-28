import Input from "@/form/Input";
import TextArea from "@/form/TextArea";
import { LeaveRequestFormInterface } from "@/src/interface/LeaveInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose, IoText } from "react-icons/io5";

const LeaveRequestForm: React.FC<ModalInterface> = (props) => {
  const [leaveRequest, setLeaveRequest] =
    React.useState<LeaveRequestFormInterface>({
      start_date: "",
      end_date: "",
      reason: "",
    });

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const role = user?.role;

  const handleLeaveRequest = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setLeaveRequest((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitLeaveRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/${role}/leave_request`,
          { ...leaveRequest, user_id: user.current, leave_type_id: props.id },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
              p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full max-h-full h-full my-auto max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-blue rounded-t-lg font-bold text-accent-yellow">
          Request Leave
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitLeaveRequest(e)}
          className="w-full h-full flex flex-col items-center justify-start p-2 gap-4 t:p-4"
        >
          <Input
            type="datetime-local"
            id="start_date"
            name="start_date"
            placeholder="Start Date"
            required={true}
            label={true}
            onChange={handleLeaveRequest}
            value={leaveRequest?.start_date}
          />

          <Input
            type="datetime-local"
            id="end_date"
            name="end_date"
            placeholder="End Date"
            required={true}
            label={true}
            onChange={handleLeaveRequest}
            value={leaveRequest?.end_date}
          />

          <TextArea
            id="reason"
            name="reason"
            onChange={handleLeaveRequest}
            placeholder="Reason"
            required={true}
            value={leaveRequest?.reason}
            rows={10}
            icon={<IoText />}
          />

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestForm;
