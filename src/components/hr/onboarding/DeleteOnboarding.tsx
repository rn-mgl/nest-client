"use client";

import {
  DeleteModal as DeleteModalInterface,
  Modal as ModalInterface,
} from "@/src/interface/ModalInterface";
import useGlobalContext from "@/src/utils/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";

const DeleteOnboarding: React.FC<ModalInterface & DeleteModalInterface> = (
  props
) => {
  const { url } = useGlobalContext();
  const { data } = useSession({ required: true });
  const user = data?.user;

  const submitDeleteOnboarding = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken(url);

      if (token && user?.token) {
        const { data: deletedOnboarding } = await axios.delete(
          `${url}/hr/onboarding/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
            withCredentials: true,
          }
        );

        if (deletedOnboarding.success) {
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

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
                    p-4 t:p-8 z-50 bg-gradient-to-b from-accent-yellow/30 to-accent-purple/30 animate-fade"
    >
      <div className="w-full h-auto max-w-screen-t bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-red-600 rounded-t-lg font-bold text-neutral-100">
          Delete Onboarding
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitDeleteOnboarding(e)}
          className="w-full h-full p-4 flex flex-col items-center justify-start gap-4 text-center"
        >
          <p className="font-bold">
            Are you sure you want to delete this Onboarding?
          </p>

          <button className="w-full font-bold text-center rounded-md p-2 bg-red-600 text-neutral-100 mt-2">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteOnboarding;