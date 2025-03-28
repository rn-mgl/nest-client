import { ModalInterface } from "@/src/interface/ModalInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";

const DeleteTraining: React.FC<ModalInterface> = (props) => {
  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const submitDeleteTraining = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: deletedTraining } = await axios.delete(
          `${url}/hr/training/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-XSRF_TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (deletedTraining.success) {
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
                        p-4 t:p-8 z-50 bg-linear-to-b from-accent-yellow/30 to-accent-purple/30 animate-fade"
    >
      <div className="w-full h-auto max-w-(--breakpoint-t) bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-red-600 rounded-t-lg font-bold text-neutral-100">
          Delete Performance Review
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitDeleteTraining(e)}
          className="w-full h-full p-4 flex flex-col items-center justify-start gap-4 text-center"
        >
          <p className="font-bold">
            Are you sure you want to delete this Training?
          </p>

          <button className="w-full font-bold text-center rounded-md p-2 bg-red-600 text-neutral-100 mt-2">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteTraining;
