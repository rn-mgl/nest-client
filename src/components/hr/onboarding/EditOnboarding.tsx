"use client";

import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import {
  ModalInterface,
  UpdateModalInterface,
} from "@/src/interface/ModalInterface";
import {
  OnboardingContentsSetInterface,
  OnboardingInterface,
  OnboardingPolicyAcknowledgemenSetInterface,
  OnboardingRequiredDocumentSetInterface,
} from "@/src/interface/OnboardingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoClose, IoReader, IoText, IoTrash } from "react-icons/io5";

const EditOnboarding: React.FC<ModalInterface & UpdateModalInterface> = (
  props
) => {
  const [onboarding, setOnboarding] = React.useState<
    OnboardingInterface & OnboardingContentsSetInterface
  >({
    title: "",
    description: "",
    required_documents: [],
    policy_acknowledgements: [],
  });
  const [documentsToDelete, setDocumentsToDelete] = React.useState<
    Array<number>
  >([]);
  const [policiesToDelete, setPoliciesToDelete] = React.useState<Array<number>>(
    []
  );

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const getOnboarding = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data } = await axios.get(`${url}/hr/onboarding/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
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

  const handleDynamicFields = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;

    setOnboarding((prev) => {
      if (name === "required_documents") {
        const currentField = prev[name as keyof object];

        const updatedField: Array<OnboardingRequiredDocumentSetInterface> = [
          ...currentField,
        ];

        updatedField[index]["document"] = value;

        return {
          ...prev,
          [name]: [...updatedField],
        };
      } else if (name === "policy_acknowledgements") {
        const currentField = prev[name as keyof object];

        const updatedField: Array<OnboardingPolicyAcknowledgemenSetInterface> =
          [...currentField];

        updatedField[index]["policy"] = value;

        return {
          ...prev,
          [name]: [...updatedField],
        };
      }

      return prev;
    });
  };

  const addDynamicFields = (name: string) => {
    setOnboarding((prev) => {
      const newField:
        | OnboardingPolicyAcknowledgemenSetInterface
        | OnboardingRequiredDocumentSetInterface =
        name === "required_documents"
          ? { document: "" }
          : name === "policy_acknowledgements"
          ? { policy: "" }
          : { document: "", policy: "" };
      const field: Array<string> = prev[name as keyof object] ?? [];

      const updatedField = [...field, newField];

      return {
        ...prev,
        [name]: updatedField,
      };
    });
  };

  const removeDynamicFields = (name: string, index: number) => {
    setOnboarding((prev) => {
      const field: Array<string> = prev[name as keyof object];
      field.splice(index, 1);

      return {
        ...prev,
        [name]: field,
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

  console.log(policiesToDelete);

  const submitUpdateOnboarding = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: updatedOnboarding } = await axios.patch(
          `${url}/hr/onboarding/${props.id}`,
          { ...onboarding, documentsToDelete, policiesToDelete },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
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

  const mappedRequiredDocuments = onboarding.required_documents.map(
    (req, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-row gap-2 items-center justify-center"
        >
          <input
            type="text"
            name="required_documents"
            placeholder={`Required Document ${index + 1}`}
            onChange={(e) => handleDynamicFields(e, index)}
            value={req.document}
            className="w-full p-2 px-4 rounded-md border-2 outline-none focus:border-neutral-900 transition-all"
          />

          <button
            type="button"
            onClick={() => {
              removeDynamicFields("required_documents", index);
              handleDocumentsToDelete(req.onboarding_required_documents_id);
            }}
            className="p-3 border-2 border-neutral-100 rounded-md bg-neutral-100"
          >
            <IoTrash />
          </button>
        </div>
      );
    }
  );

  const mappedPolicyAcknowledgements = onboarding.policy_acknowledgements.map(
    (ack, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-row gap-2 items-center justify-center"
        >
          <input
            type="text"
            name="policy_acknowledgements"
            placeholder={`Policy Acknowledgement ${index + 1}`}
            onChange={(e) => handleDynamicFields(e, index)}
            value={ack.policy}
            className="w-full p-2 px-4 rounded-md border-2 outline-none focus:border-neutral-900 transition-all"
          />

          <button
            type="button"
            onClick={() => {
              removeDynamicFields("policy_acknowledgements", index);
              handlePoliciesToDelete(ack.onboarding_policy_acknowledgements_id);
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
    p-4 t:p-8 z-50 bg-gradient-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-auto max-w-screen-t bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
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
          className="w-full h-full p-4 flex flex-col items-center justify-start gap-4"
        >
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

          <div className="w-full flex flex-col items-center justify-start gap-4 l-s:flex-row l-s:items-start l-s:justify-center">
            <div className="w-full flex flex-col items-center justify-start gap-2 max-h-40 l-l:max-h-64">
              <div className="w-full flex flex-row items-center justify-between">
                <label className="text-xs">Required Documents</label>

                <button
                  type="button"
                  title="Add Required Documents Field"
                  className="p-2 rounded-md bg-neutral-100"
                  onClick={() => addDynamicFields("required_documents")}
                >
                  <IoAdd />
                </button>
              </div>

              <div className="w-full flex flex-col items-center justify-start gap-2 overflow-y-auto">
                {mappedRequiredDocuments}
              </div>
            </div>

            <div className="w-full flex flex-col items-center justify-start gap-2 max-h-40 l-l:max-h-64">
              <div className="w-full flex flex-row items-center justify-between">
                <label className="text-xs">Policy Acknowledgements</label>

                <button
                  type="button"
                  title="Add Required Documents Field"
                  className="p-2 rounded-md bg-neutral-100"
                  onClick={() => addDynamicFields("policy_acknowledgements")}
                >
                  <IoAdd />
                </button>
              </div>

              <div className="w-full flex flex-col items-center justify-start gap-2 overflow-y-auto">
                {mappedPolicyAcknowledgements}
              </div>
            </div>
          </div>

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-yellow text-accent-blue mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditOnboarding;
