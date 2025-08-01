import useModalNav from "@/src/hooks/useModalNav";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  TrainingContentInterface,
  TrainingInterface,
  TrainingReviewInterface,
} from "@/src/interface/TrainingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import ModalNav from "../../global/ModalNav";
import TextBlock from "../../global/field/TextBlock";
import TextField from "../../global/field/TextField";

const ShowTraining: React.FC<ModalInterface> = (props) => {
  const [training, setTraining] = React.useState<
    TrainingInterface & { contents: TrainingContentInterface[] } & {
      reviews: TrainingReviewInterface[];
    }
  >({
    title: "",
    description: "",
    certificate: "",
    deadline_days: 30,
    contents: [],
    reviews: [],
  });

  const { activeFormPage, handleActiveFormPage } = useModalNav("information");

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const getTraining = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/hr/training/${props.id}`,
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
        <TextField label="Title" value={content.title} />
        <TextBlock label="Description" value={content.description} />

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
          ) : content.type === "audio" ? (
            <div className="w-full p-2 rounded-md bg-white border-2">
              <audio
                src={currentContent}
                controls
                className="rounded-md"
              ></audio>
            </div>
          ) : content.type === "file" ? (
            <div className="w-full p-2 rounded-md border-2 bg-white flex flex-row items-center justify-start">
              <Link
                href={currentContent}
                target="_blank"
                className="flex flex-row items-center justify-center gap-2 group transition-all hover:underline underline-offset-2"
              >
                <div className="text-2xl aspect-square rounded-xs bg-accent-purple/50 p-2 group-hover:bg-accent-purple/80 transition-all">
                  <AiFillFilePdf className="text-white" />
                </div>
                <span className="group-hover:underline underline-offset-2 transition-all text-sm">
                  View {content.title} Document
                </span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    );
  });

  const mappedReviews = training.reviews.map((review, index) => {
    const answer =
      review[`choice_${review.answer}` as keyof TrainingReviewInterface];
    return (
      <div
        key={index}
        className="w-full flex flex-col items-center justify-center gap-2"
      >
        <p className="w-full py-2 border-b-2 border-accent-purple">
          {index + 1}.
        </p>
        <TextBlock label="Question" value={review.question} />
        <TextField label="Answer" value={answer ?? ""} />
      </div>
    );
  });

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
        <div className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 overflow-hidden t:p-4">
          <ModalNav
            activeFormPage={activeFormPage}
            pages={["information", "contents", "reviews"]}
            handleActiveFormPage={handleActiveFormPage}
          />

          <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto">
            {activeFormPage === "information" ? (
              <div className="w-full h-full flex flex-col items-center justify-start gap-4">
                <TextField label="Title" value={training.title} />
                <TextField
                  label="Deadline Days"
                  value={training.deadline_days}
                />
                <TextBlock label="Description" value={training.description} />

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
                          <div className="text-2xl aspect-square rounded-xs bg-accent-purple/50 p-2 group-hover:bg-accent-purple/80 transition-all">
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
            ) : activeFormPage === "contents" ? (
              <div className="w-full flex flex-col items-center justify-start p-2 gap-4">
                {mappedContents}
              </div>
            ) : activeFormPage === "reviews" ? (
              <div className="w-full flex flex-col items-center justify-start p-2 gap-4">
                {mappedReviews}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowTraining;
