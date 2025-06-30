import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import useDynamicFields from "@/src/hooks/useDynamicFields";
import useModalNav from "@/src/hooks/useModalNav";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  OnboardingInterface,
  OnboardingPolicyAcknowledgemenInterface,
  OnboardingRequiredDocumentsInterface,
} from "@/src/interface/OnboardingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useToasts } from "@/src/context/ToastContext";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoClose, IoReader, IoText, IoTrash } from "react-icons/io5";
import ModalNav from "../../global/ModalNav";

const CreateOnboarding: React.FC<ModalInterface> = (props) => {
  const [onboarding, setOnboarding] = React.useState<OnboardingInterface>({
    title: "",
    description: "",
  });

  const {
    fields: required_documents,
    addField: addDocumentField,
    handleField: handleDocumentField,
    removeField: removeDocumentField,
  } = useDynamicFields<OnboardingRequiredDocumentsInterface>([
    { title: "", description: "" },
  ]);

  const {
    fields: policy_acknowledgements,
    addField: addPolicyField,
    handleField: handlePolicyField,
    removeField: removePolicyField,
  } = useDynamicFields<OnboardingPolicyAcknowledgemenInterface>([
    { title: "", description: "" },
  ]);

  const { activeFormPage, handleActiveFormPage } = useModalNav("information");
  const { addToast } = useToasts();

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleOnboarding = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setOnboarding((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const mappedRequiredDocuments = required_documents.map((req, index) => {
    return (
      <div
        key={index}
        className="w-full flex flex-row gap-2 items-start justify-center"
      >
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          <input
            type="text"
            name="required_document_title"
            placeholder={`Required Document Title ${index + 1}`}
            onChange={(e) => handleDocumentField(e, "title", index)}
            value={req.title}
            className="w-full p-2 px-4 rounded-md border-2 outline-hidden focus:border-neutral-900 transition-all bg-white"
          />

          <textarea
            name="required_document_description"
            placeholder={`Description ${index + 1}`}
            onChange={(e) => handleDocumentField(e, "description", index)}
            value={req.description}
            rows={5}
            className="w-full p-2 px-4 rounded-md border-2 outline-hidden focus:border-neutral-900 transition-all bg-white resize-none"
          />
        </div>

        <button
          type="button"
          onClick={() => removeDocumentField(index)}
          className="p-3 border-2 border-neutral-100 rounded-md bg-neutral-100"
        >
          <IoTrash />
        </button>
      </div>
    );
  });

  const mappedPolicyAcknowledgements = policy_acknowledgements.map(
    (ack, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-row gap-2 items-center justify-center"
        >
          <div className="flex flex-col items-center justify-center gap-2 w-full">
            <input
              type="text"
              name="policy_acknowledgement_title"
              placeholder={`Policy Acknowledgement Title ${index + 1}`}
              onChange={(e) => handlePolicyField(e, "title", index)}
              value={ack.title}
              className="w-full p-2 px-4 rounded-md border-2 outline-hidden focus:border-neutral-900 transition-all bg-white"
            />

            <textarea
              name="policy_acknowledgement_title"
              placeholder={`Description ${index + 1}`}
              onChange={(e) => handlePolicyField(e, "description", index)}
              value={ack.description}
              rows={5}
              className="w-full p-2 px-4 rounded-md border-2 outline-hidden focus:border-neutral-900 transition-all bg-white resize-none"
            />
          </div>

          <button
            type="button"
            onClick={() => removePolicyField(index)}
            className="p-3 border-2 border-neutral-100 rounded-md bg-neutral-100"
          >
            <IoTrash />
          </button>
        </div>
      );
    }
  );

  const submitCreateOnboarding = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: createdOnboarding } = await axios.post(
          `${url}/hr/onboarding`,
          {
            ...onboarding,
            required_documents,
            policy_acknowledgements,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (createdOnboarding.success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }
          addToast(
            "Onboarding Created",
            `${onboarding.title} has been successfully created.`,
            "success"
          );
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
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-blue rounded-t-lg font-bold text-accent-yellow">
          Create Onboarding
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitCreateOnboarding(e)}
          className="w-full h-full p-4 flex flex-col items-center justify-center gap-4 overflow-hidden"
        >
          <ModalNav
            activeFormPage={activeFormPage}
            pages={["information", "documents", "acknowledgements"]}
            handleActiveFormPage={handleActiveFormPage}
          />

          {activeFormPage === "information" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-2 p-2">
              <Input
                label={true}
                id="title"
                onChange={handleOnboarding}
                placeholder="Title"
                required={true}
                type="text"
                value={onboarding.title}
                icon={<IoText />}
              />

              <TextArea
                label={true}
                id="description"
                onChange={handleOnboarding}
                placeholder="Description"
                required={true}
                value={onboarding.description}
                rows={5}
                icon={<IoReader />}
              />
            </div>
          ) : activeFormPage === "documents" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4 l-s:items-start l-s:justify-center overflow-y-hidden t:flex-row">
              <div className="w-full flex flex-col items-center justify-start h-full gap-2 overflow-hidden">
                <div className="w-full flex flex-row items-center justify-between">
                  <label className="text-xs">Required Documents</label>

                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-2 rounded-md bg-neutral-100"
                    onClick={() =>
                      addDocumentField({ title: "", description: "" })
                    }
                  >
                    <IoAdd />
                  </button>
                </div>

                <div className="w-full flex flex-col items-center justify-start gap-2 overflow-y-auto">
                  {mappedRequiredDocuments}
                </div>
              </div>
            </div>
          ) : activeFormPage === "acknowledgements" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4 l-s:items-start l-s:justify-center overflow-y-hidden t:flex-row">
              <div className="w-full flex flex-col items-center justify-start h-full gap-2 overflow-hidden">
                <div className="w-full flex flex-row items-center justify-between">
                  <label className="text-xs">Policy Acknowledgements</label>

                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-2 rounded-md bg-neutral-100"
                    onClick={() =>
                      addPolicyField({ title: "", description: "" })
                    }
                  >
                    <IoAdd />
                  </button>
                </div>

                <div className="w-full flex flex-col items-center justify-start gap-2 overflow-y-auto">
                  {mappedPolicyAcknowledgements}
                </div>
              </div>
            </div>
          ) : null}

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOnboarding;
