import { DocumentInterface } from "@/src/interface/DocumentInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";
import { IoClose, IoText } from "react-icons/io5";
import File from "@/form/File";
import Input from "@/form/Input";
import TextArea from "@/form/TextArea";

const CreateDocument: React.FC<ModalInterface> = (props) => {
  const [document, setDocument] = React.useState<DocumentInterface>({
    name: "",
    description: "",
    type: "",
    document: null,
  });

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;
  const params = useParams();
  const folderId = params?.folder_id ?? 0;

  const documentRef = React.useRef<HTMLInputElement | null>(null);

  const handleDocument = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "document") {
      const { files } = e.target as HTMLInputElement;

      if (!files || !files.length) return;

      const file = files[0];
      const type = file.type.split("/")[1];
      const url = URL.createObjectURL(file);
      const documentValue = { rawFile: file, fileURL: url };

      setDocument((prev) => {
        return {
          ...prev,
          type: type,
          document: documentValue,
        };
      });
    } else {
      setDocument((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const submitCreateDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      const formData = new FormData();

      const attachment =
        document.document && typeof document.document === "object"
          ? document.document.rawFile
          : "";

      formData.append("name", document.name);
      formData.append("description", document.description);
      formData.append("type", document.type);
      formData.append("path", folderId.toString());
      formData.append("document", attachment);

      if (token && user?.token) {
        const { data: createdDocument } = await axios.post(
          `${url}/hr/document`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (createdDocument.success) {
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

  const removeSelectedDocument = () => {
    if (documentRef.current) {
      documentRef.current.value = "";
      documentRef.current.files = null;
    }

    setDocument((prev) => {
      return {
        ...prev,
        document: null,
      };
    });
  };

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
              p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade"
    >
      <div className="w-full h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-blue rounded-t-lg font-bold text-accent-yellow">
          Create Document
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitCreateDocument(e)}
          className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 t:p-4"
        >
          <Input
            label={true}
            id="name"
            name="name"
            onChange={handleDocument}
            placeholder="Name"
            required={true}
            type="text"
            value={document.name}
            icon={<IoText />}
          />

          <TextArea
            label={true}
            required={true}
            id="description"
            name="description"
            onChange={handleDocument}
            placeholder="Description"
            value={document.description}
          />

          <File
            accept="application/pdf"
            id="document"
            name="document"
            label="Document"
            type="file"
            onChange={handleDocument}
            removeSelectedFile={removeSelectedDocument}
            ref={documentRef}
            file={
              document.document && typeof document.document === "object"
                ? document.document.rawFile
                : null
            }
          />

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDocument;
