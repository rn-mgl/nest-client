"use client";

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

import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoClose, IoReader, IoText, IoTrash } from "react-icons/io5";
import ModalNav from "../../global/ModalNav";

const EditOnboarding: React.FC<ModalInterface> = (props) => {
  const [onboarding, setOnboarding] = React.useState<OnboardingInterface>({
    title: "",
    description: "",
  });
  const [documentsToDelete, setDocumentsToDelete] = React.useState<
    Array<number>
  >([]);
  const [policiesToDelete, setPoliciesToDelete] = React.useState<Array<number>>(
    []
  );

  const {
    fields: required_documents,
    addField: addDocumentField,
    removeField: removeDocumentField,
    handleField: handleDocumentField,
    populateFields: populateDocumentFields,
  } = useDynamicFields<OnboardingRequiredDocumentsInterface>([]);
  const {
    fields: policy_acknowledgements,
    addField: addPolicyField,
    removeField: removePolicyField,
    handleField: handlePolicyField,
    populateFields: populatePolicyFields,
  } = useDynamicFields<OnboardingPolicyAcknowledgemenInterface>([]);
  const { activeFormPage, handleActiveFormPage } = useModalNav("information");

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const getOnboarding = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const {
          data: { onboarding },
        } = await axios.get<{
          onboarding: OnboardingInterface & {
            required_documents: OnboardingRequiredDocumentsInterface[];
            policy_acknowledgements: OnboardingPolicyAcknowledgemenInterface[];
          };
        }>(`${url}/hr/onboarding/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-CSRF-TOKEN": token,
          },
          withCredentials: true,
        });

        if (onboarding) {
          setOnboarding(onboarding);
          populateDocumentFields(onboarding.required_documents);
          populatePolicyFields(onboarding.policy_acknowledgements);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    url,
    user?.token,
    props.id,
    populateDocumentFields,
    populatePolicyFields,
  ]);

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

  const handleDocumentsToDelete = (id: number | undefined) => {
    if (!id) return;

    setDocumentsToDelete((prev) => [...prev, id]);
  };

  const handlePoliciesToDelete = (id: number | undefined) => {
    if (!id) return;

    setPoliciesToDelete((prev) => [...prev, id]);
  };

  const submitUpdateOnboarding = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: updatedOnboarding } = await axios.patch(
          `${url}/hr/onboarding/${props.id}`,
          {
            ...onboarding,
            required_documents,
            policy_acknowledgements,
            documentsToDelete,
            policiesToDelete,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (updatedOnboarding.success) {
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

  const mappedRequiredDocuments = required_documents.map((req, index) => {
    return (
      <div
        key={index}
        className="w-full flex flex-row gap-2 items-start justify-center"
      >
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <input
            type="text"
            name="required_document_title"
            placeholder={`Document Title ${index + 1}`}
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
          onClick={() => {
            removeDocumentField(index);
            handleDocumentsToDelete(req.onboarding_required_document_id);
          }}
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
          className="w-full flex flex-row gap-2 items-start justify-center"
        >
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <input
              type="text"
              name="policy_acknowledgement_title"
              placeholder={`Policy Acknowledgement ${index + 1}`}
              onChange={(e) => handlePolicyField(e, "title", index)}
              value={ack.title}
              className="w-full p-2 px-4 rounded-md border-2 outline-hidden focus:border-neutral-900 transition-all bg-white"
            />
            <textarea
              name="policy_acknowledgement_description"
              placeholder={`Description ${index + 1}`}
              onChange={(e) => handlePolicyField(e, "description", index)}
              value={ack.description}
              rows={5}
              className="w-full p-2 px-4 rounded-md border-2 outline-hidden focus:border-neutral-900 transition-all resize-none bg-white"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              removePolicyField(index);
              handlePoliciesToDelete(ack.onboarding_policy_acknowledgement_id);
            }}
            className="p-3 border-2 border-neutral-100 rounded-md bg-neutral-100"
          >
            <IoTrash />
          </button>
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
    p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-yellow rounded-t-lg font-bold text-accent-blue">
          Edit Onboarding
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitUpdateOnboarding(e)}
          className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 overflow-hidden t:p-4"
        >
          <ModalNav
            activeFormPage={activeFormPage}
            pages={["information", "documents", "acknowledgements"]}
            handleActiveFormPage={handleActiveFormPage}
          />

          {activeFormPage === "information" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4">
              <Input
                label={true}
                id="title"
                name="title"
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
                name="description"
                onChange={handleOnboarding}
                placeholder="Description"
                required={true}
                value={onboarding.description}
                rows={5}
                icon={<IoReader />}
              />
            </div>
          ) : activeFormPage === "documents" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4 l-s:items-start l-s:justify-center t:flex-row overflow-hidden">
              <div className="w-full flex flex-col items-center justify-start gap-2 h-full overflow-hidden">
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

                <div className="w-full flex flex-col items-center justify-start gap-2 h-full overflow-y-auto">
                  {mappedRequiredDocuments}
                </div>
              </div>
            </div>
          ) : activeFormPage === "acknowledgements" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4 l-s:items-start l-s:justify-center t:flex-row overflow-hidden">
              <div className="w-full flex flex-col items-center justify-start gap-2 h-full overflow-hidden">
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

                <div className="w-full flex flex-col items-center justify-start gap-2 h-full overflow-y-auto">
                  {mappedPolicyAcknowledgements}
                </div>
              </div>
            </div>
          ) : null}

          <button className="t:col-span-2 w-full font-bold text-center rounded-md p-2 bg-accent-yellow text-accent-blue mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditOnboarding;
