"use client";

import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  EmployeeTrainingInterface,
  TrainingContentInterface,
  TrainingInterface,
} from "@/src/interface/TrainingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";

const ShowTraining: React.FC<ModalInterface> = (props) => {
  const [training, setTraining] = React.useState<
    TrainingInterface &
      EmployeeTrainingInterface & { contents: TrainingContentInterface[] }
  >({
    title: "",
    certificate: "",
    contents: [],
    deadline: "",
    deadline_days: 0,
    description: "",
    status: "",
  });

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const getTraining = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/employee_training/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.training) {
          setTraining(responseData.training);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  console.log(training);

  React.useEffect(() => {
    getTraining();
  }, [getTraining]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
        p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start overflow-hidden">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "Training Details"}
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full h-full p-4 flex flex-col items-center justify-start gap-4 overflow-hidden"></div>
      </div>
    </div>
  );
};

export default ShowTraining;
