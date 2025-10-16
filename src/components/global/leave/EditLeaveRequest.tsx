"use client";

import Input from "@/form/Input";
import TextArea from "@/form/TextArea";
import { useToasts } from "@/src/context/ToastContext";
import { LeaveRequestFormInterface } from "@/src/interface/LeaveInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";

const EditLeaveRequest: React.FC<ModalInterface> = (props) => {
  const [leaveRequest, setLeaveRequest] =
    React.useState<LeaveRequestFormInterface>({
      reason: "",
      end_date: "",
      start_date: "",
    });

  const { addToast } = useToasts();

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const role = user?.roles ?? "";

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

  const getLeaveRequest = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/${role}/leave_request/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
          }
        );

        if (responseData.request) {
          setLeaveRequest(responseData.request);
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the leave request is being retrieved.";
        addToast("Leave Request Error", message, "error");
      }
    }
  }, [url, user?.token, role, props.id, addToast]);

  const submitUpdateLeaveRequest = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.patch(
          `${url}/${role}/leave_request/${props.id}`,
          { ...leaveRequest },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }
          addToast(
            "Leave Request Updated",
            `Leave request has been updated.`,
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
          "An error occurred when the leave request is being updated.";
        addToast("Leave Request Error", message, "error");
      }
    }
  };

  React.useEffect(() => {
    getLeaveRequest();
  }, [getLeaveRequest]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
                  p-4 t:p-8 z-50 bg-linear-to-b from-accent-yellow/30 to-accent-purple/30 animate-fade"
    >
      <div className="w-full h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-yellow rounded-t-lg font-bold text-accent-blue">
          Update Leave Request
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitUpdateLeaveRequest(e)}
          className="w-full h-full p-2 flex flex-col items-center justify-center t:p-4 gap-4"
        >
          <Input
            id="start_date"
            name="start_date"
            placeholder="Start Date"
            required={true}
            type="datetime-local"
            value={leaveRequest.start_date}
            label={true}
            onChange={handleLeaveRequest}
          />

          <Input
            id="end_date"
            name="end_date"
            placeholder="End Date"
            required={true}
            type="datetime-local"
            value={leaveRequest.end_date}
            label={true}
            onChange={handleLeaveRequest}
          />

          <TextArea
            id="reason"
            name="reason"
            onChange={handleLeaveRequest}
            placeholder="Reason"
            required={true}
            value={leaveRequest.reason}
            label={true}
          />

          <button className="w-full p-2 rounded-md text-accent-blue font-bold mt-2 bg-accent-yellow">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditLeaveRequest;
