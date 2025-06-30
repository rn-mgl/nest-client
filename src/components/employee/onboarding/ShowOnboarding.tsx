import useModalNav from "@/src/hooks/useModalNav";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  EmployeeOnboardingInterface,
  OnboardingInterface,
  OnboardingPolicyAcknowledgemenInterface,
  OnboardingRequiredDocumentsInterface,
} from "@/src/interface/OnboardingInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";
import ModalNav from "../../global/ModalNav";
import TextBlock from "../../global/field/TextBlock";
import TextField from "../../global/field/TextField";

const ShowOnboarding: React.FC<ModalInterface> = (props) => {
  const [onboarding, setOnboarding] = React.useState<
    EmployeeOnboardingInterface & {
      onboarding: OnboardingInterface & {
        policy_acknowledgements: OnboardingPolicyAcknowledgemenInterface[];
        required_documents: OnboardingRequiredDocumentsInterface[];
      };
      assigned_by: UserInterface;
    }
  >();

  const { activeFormPage, handleActiveFormPage } = useModalNav("information");

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const handleSendDocuments = () => {
    window.location.href = `mailto:${onboarding?.assigned_by.email}?subject=Onboarding Required Documents`;
  };

  const getOnboarding = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/employee_onboarding/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.onboarding) {
          setOnboarding(responseData.onboarding);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [props.id, url, user?.token]);

  const handleAcknowledge = async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.patch(
          `${url}/employee/employee_onboarding/${props.id}`,
          { policy_acknowledged: true },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          await getOnboarding();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedRequiredDocuments = onboarding?.onboarding.required_documents.map(
    (document, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-col items-center justify-start gap-2"
        >
          <div className="w-full p-2 rounded-md border-2 bg-white">
            {document.title}
          </div>
          <div className="w-full p-2 rounded-md border-2 bg-white h-40 overflow-y-auto">
            {document.description}
          </div>
        </div>
      );
    }
  );

  const mappedPolicyAcknowledgements =
    onboarding?.onboarding.policy_acknowledgements.map((policy, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-col items-center justify-center gap-2 "
        >
          <div className="w-full p-2 rounded-md border-2 bg-white">
            {policy.title}
          </div>
          <div className="w-full p-2 rounded-md border-2 bg-white h-40 overflow-y-auto">
            {policy.description}
          </div>
        </div>
      );
    });

  React.useEffect(() => {
    getOnboarding();
  }, [getOnboarding]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
      p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "Onboarding Details"}
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full h-full flex flex-col items-center justify-start gap-4 p-4 overflow-y-hidden">
          <ModalNav
            activeFormPage={activeFormPage}
            handleActiveFormPage={handleActiveFormPage}
            pages={["information", "documents", "policies"]}
          />

          {activeFormPage === "information" ? (
            <div className="w-full flex flex-col items-center justify-start gap-4 h-full">
              <TextField
                label="Title"
                value={onboarding?.onboarding.title as string}
              />

              <TextBlock
                label="Description"
                value={onboarding?.onboarding.description as string}
              />
            </div>
          ) : activeFormPage === "documents" ? (
            <div className="w-full h-full flex flex-col items-start justify-start gap-4 overflow-y-hidden">
              <label className="text-xs">Required Documents</label>

              <div className="w-full flex flex-col items-center justify-start gap-4 overflow-y-auto">
                {mappedRequiredDocuments}
              </div>

              <button
                onClick={handleSendDocuments}
                className="w-full p-2 rounded-md bg-accent-blue text-neutral-100 font-bold mt-auto"
              >
                Send Documents
              </button>
            </div>
          ) : activeFormPage === "policies" ? (
            <div className="w-full h-full flex flex-col items-start justify-start gap-4 overflow-y-hidden">
              <label className="text-xs">Policy Acknowledgements</label>

              <div className="w-full flex flex-col items-center justify-start gap-4 overflow-y-auto">
                {mappedPolicyAcknowledgements}
              </div>

              {onboarding?.policy_acknowledged ? (
                <div className="w-full p-2 rounded-md text-accent-blue border-2 border-accent-blue font-bold mt-auto text-center">
                  Policy Acknowledged
                </div>
              ) : (
                <button
                  onClick={handleAcknowledge}
                  className="w-full p-2 rounded-md bg-accent-blue text-neutral-100 font-bold mt-auto"
                >
                  Acknowledge
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ShowOnboarding;
