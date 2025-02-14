import { DocumentInterface } from "@/src/interface/DocumentInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { IoAdd, IoClose, IoText } from "react-icons/io5";
import Input from "../../form/Input";
import TextArea from "../../form/TextArea";
import { useParams } from "next/navigation";

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
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
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
              p-4 t:p-8 z-50 bg-gradient-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade"
    >
      <div className="w-full h-auto max-w-screen-l-s bg-neutral-100 shadow-md rounded-lg ">
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
          className="w-full h-full p-4 flex flex-col items-center justify-start gap-4"
        >
          <Input
            label={true}
            id="name"
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
            onChange={handleDocument}
            placeholder="Description"
            value={document.description}
          />

          <div className="w-full flex flex-col items-start justify-between gap-4">
            {document.document &&
            typeof document.document === "object" &&
            document.document.rawFile ? (
              <div className="p-2 w-full rounded-md border-2 bg-white flex flex-col items-center justify-center bg-center bg-cover relative">
                <div className="w-full flex flex-row items-center justify-start gap-2">
                  <div className="aspect-square p-2.5 rounded-sm bg-accent-blue/50">
                    <AiFillFilePdf className="text-white text-2xl" />
                  </div>
                  <p className="truncate text-sm">
                    {document.document?.rawFile.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeSelectedDocument}
                  className="absolute -top-1 -right-1 bg-red-500 p-1 rounded-full"
                >
                  <IoClose className="text-sm" />
                </button>
              </div>
            ) : (
              <label
                className="p-2 w-full h-16 rounded-md border-2  flex flex-row items-center 
              justify-center  text-accent-purple gap-1 cursor-pointer bg-white"
              >
                <input
                  type="file"
                  accept=".pdf"
                  name="document"
                  className="hidden "
                  ref={documentRef}
                  onChange={(e) => handleDocument(e)}
                />

                <span className="text-sm">Attach Document</span>
                <IoAdd />
              </label>
            )}
          </div>

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDocument;
