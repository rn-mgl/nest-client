"use client";

import { ShowModal as ShowModalInterface } from "@/src/interface/ModalInterface";
import { Onboarding as OnboardingInterface } from "@/src/interface/OnboardingInterface";
import useGlobalContext from "@/src/utils/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { IoCaretForwardSharp, IoClose } from "react-icons/io5";

const ShowOnboarding: React.FC<ShowModalInterface> = (props) => {
  const [onboarding, setOnboarding] = React.useState<OnboardingInterface>({
    title: "",
    description: "",
    policy_acknowledgements: [""],
    required_documents: [""],
  });

  const { url } = useGlobalContext();
  const { data } = useSession({ required: true });
  const user = data?.user;

  const getOnboarding = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken(url);
      if (token) {
        const { data } = await axios.get(`${url}/hr/onboarding/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
          },
          withCredentials: true,
        });

        if (data) {
          setOnboarding(data.onboarding);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const mappedRequiredDocuments = onboarding.required_documents.map(
    (req, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-row items-center justify-start bg-neutral-200 p-2 rounded-md gap-2"
        >
          <IoCaretForwardSharp />
          <p>{req}</p>
        </div>
      );
    }
  );

  const mappedPolicyAcknowledgements = onboarding.policy_acknowledgements.map(
    (ack, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-row items-center justify-start bg-neutral-200 p-2 rounded-md gap-2"
        >
          <IoCaretForwardSharp />
          <p>{ack}</p>
        </div>
      );
    }
  );

  React.useEffect(() => {
    getOnboarding();
  }, [getOnboarding]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
    p-4 t:p-8 z-50 bg-gradient-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade"
    >
      <div className="w-full my-auto h-auto max-w-screen-t bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "Onboarding Details"}
          <button
            onClick={() => props.setActiveModal(0)}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full h-full p-4 flex flex-col items-start justify-start gap-4">
          <div className="flex flex-col items-start justify-center w-full gap-1">
            <p className="text-xs">Title</p>
            <div className="w-full p-2 px-4 rounded-md border-2 relative overflow-x-auto">
              <p>{onboarding.title}</p>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center w-full gap-1">
            <p className="text-xs">Description</p>
            <div className="w-full p-2 px-4 rounded-md border-2 relative overflow-x-auto h-40 overflow-y-auto">
              <p>{onboarding.description}</p>
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center gap-4 l-s:flex-row">
            <div className="w-full flex flex-col items-start justify-center gap-1">
              <p className="text-xs">Required Documents</p>
              <div className="w-full flex flex-col gap-2 items-center justify-start h-full overflow-y-auto py-2 l-s:max-h-72">
                {mappedRequiredDocuments}
                {mappedRequiredDocuments}
                {mappedRequiredDocuments}
                {mappedRequiredDocuments}
              </div>
            </div>

            <div className="w-full flex flex-col items-start justify-center gap-1">
              <p className="text-xs">Policy Acknowledgements</p>
              <div className="w-full flex flex-col gap-2 items-center justify-start h-full overflow-y-auto py-2 l-s:max-h-72">
                {mappedPolicyAcknowledgements}
                {mappedPolicyAcknowledgements}
                {mappedPolicyAcknowledgements}
                {mappedPolicyAcknowledgements}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowOnboarding;
