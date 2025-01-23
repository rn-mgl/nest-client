import useModalNav from "@/src/hooks/useModalNav";
import { ShowModalInterface } from "@/src/interface/ModalInterface";
import {
  TrainingContentsInterface,
  TrainingInterface,
} from "@/src/interface/TrainingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import ModalNav from "../../global/ModalNav";

const ShowTraining: React.FC<ShowModalInterface> = (props) => {
  const [training, setTraining] = React.useState<
    TrainingInterface & TrainingContentsInterface
  >({
    title: "",
    description: "",
    certificate: "",
    deadline_days: 30,
    contents: [],
  });

  const { activeFormPage, handleActiveFormPage } = useModalNav("information");

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const getTraining = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const {
          data: { training },
        } = await axios.get(`${url}/hr/training/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
          },
          withCredentials: true,
        });

        if (training) {
          setTraining(training);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.token, props.id, url]);

  const mappedContents = training.contents.map((content, index) => {
    const currentContent =
      typeof content.content === "string" ? content.content : "";

    return (
      <div
        key={index}
        className="w-full h-full flex flex-col items-center justify-start gap-4"
      >
        <p className="w-full py-2 border-b-2 border-accent-purple">
          {index + 1}.
        </p>
        <div className="flex flex-col items-start justify-center w-full gap-1">
          <p className="text-xs">Title</p>
          <div className="w-full p-2 px-4 rounded-md border-2 relative overflow-x-auto bg-white">
            <p>{content.title}</p>
          </div>
        </div>

        <div className="flex flex-col items-start justify-center w-full gap-1">
          <p className="text-xs">Description</p>
          <div className="w-full p-2 px-4 rounded-md border-2 relative overflow-y-auto h-48 l-s:h-52 bg-white">
            <p>{content.description}</p>
          </div>
        </div>

        <div className="flex flex-col items-start justify-center w-full gap-1">
          <p className="text-xs">Content</p>
          {content.type === "text" ? (
            <div className="w-full p-2 px-4 rounded-md border-2 relative overflow-y-auto h-48 l-s:h-52 bg-white">
              <p>{currentContent}</p>
            </div>
          ) : content.type === "image" ? (
            <div className="w-full p-2 rounded-md bg-white border-2">
              <Link
                href={currentContent}
                target="_blank"
                className="hover:brightness-90 transition-all"
              >
                <Image
                  src={currentContent}
                  alt="content"
                  width={1920}
                  height={1920}
                  className="w-full rounded-md"
                />
              </Link>
            </div>
          ) : content.type === "video" ? (
            <div className="w-full p-2 rounded-md bg-white border-2">
              <video
                src={currentContent}
                controls
                className="rounded-md"
              ></video>
            </div>
          ) : content.type === "file" ? (
            <div className="w-full p-2 rounded-md border-2 bg-white flex flex-row items-center justify-start">
              <Link
                href={currentContent}
                target="_blank"
                className="flex flex-row items-center justify-center gap-2 group transition-all"
              >
                <div className="text-2xl aspect-square rounded-sm bg-accent-purple/50 p-2 group-hover:bg-accent-purple/80 transition-all">
                  <AiFillFilePdf className="text-white" />
                </div>
                <span className="group-hover:underline underline-offset-2 transition-all text-sm">
                  View {content.title} Certificate
                </span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    );
  });

  React.useEffect(() => {
    getTraining();
  }, [getTraining]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
      p-4 t:p-8 z-50 bg-gradient-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-auto max-w-screen-l-s bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start overflow-hidden">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "Training Details"}
          <button
            onClick={() => props.setActiveModal(0)}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full h-full p-4 flex flex-col items-center justify-start gap-4 overflow-hidden">
          <ModalNav
            activeFormPage={activeFormPage}
            pages={["information", "contents"]}
            handleActiveFormPage={handleActiveFormPage}
          />

          <div className="w-full hf flex flex-col items-center justify-start overflow-y-auto">
            {activeFormPage === "information" ? (
              <div className="w-full h-full flex flex-col items-center justify-start gap-4">
                <div className="flex flex-col items-start justify-center w-full gap-1">
                  <p className="text-xs">Title</p>
                  <div className="w-full p-2 px-4 rounded-md border-2 relative overflow-x-auto bg-white">
                    <p>{training.title}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center w-full gap-1">
                  <p className="text-xs">Deadline Days</p>
                  <div className="w-full p-2 px-4 rounded-md border-2 relative overflow-x-auto bg-white">
                    <p>{training.deadline_days}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center w-full gap-1">
                  <p className="text-xs">Description</p>
                  <div className="w-full p-2 px-4 rounded-md border-2 relative overflow-y-auto h-48 l-s:h-52 bg-white">
                    <p>{training.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center w-full gap-1">
                  <p className="text-xs">Certificate</p>
                  <div className="w-full h-full p-2 rounded-md border-2 bg-white flex flex-row">
                    {training.certificate &&
                      typeof training.certificate === "string" && (
                        <Link
                          href={training.certificate}
                          target="_blank"
                          className="flex flex-row items-center justify-center gap-2 group transition-all"
                        >
                          <div className="text-2xl aspect-square rounded-sm bg-accent-purple/50 p-2 group-hover:bg-accent-purple/80 transition-all">
                            <AiFillFilePdf className="text-white" />
                          </div>
                          <span className="group-hover:underline underline-offset-2 transition-all text-sm">
                            View {training.title} Certificate
                          </span>
                        </Link>
                      )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-start p-2 gap-4">
                {mappedContents}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowTraining;
