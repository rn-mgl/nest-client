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
import Link from "next/link";
import useSelect from "@/src/hooks/useSelect";
import Select from "../../form/Select";

const EditDocument: React.FC<ModalInterface> = (props) => {
  const [document, setDocument] = React.useState<DocumentInterface>({
    name: "",
    description: "",
    document: null,
    path: 0,
    type: "",
  });

  const [paths, setPaths] = React.useState<{ label: string; value: number }[]>(
    []
  );
  const { activeSelect, toggleSelect } = useSelect();
  const documentRef = React.useRef<HTMLInputElement | null>(null);

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const getDocument = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: documentDetails } = await axios.get(
          `${url}/hr/document/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
            withCredentials: true,
          }
        );

        if (documentDetails.document) {
          setDocument(documentDetails.document);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const getPaths = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token && typeof document.path === "number") {
        const { data: folders } = await axios.get<{
          paths: { label: string; value: number }[];
        }>(`${url}/hr/document_folder/paths`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
          },
          params: { path: document.path },
          withCredentials: true,
        });

        if (folders.paths) {
          // start off with Home
          folders.paths.unshift({ label: "Home", value: 0 });
          setPaths(folders.paths);

          const pathValue = folders.paths.find((path) => {
            return (
              document.path &&
              typeof document.path === "number" &&
              document.path === path.value
            );
          });

          setDocument((prev) => {
            return {
              ...prev,
              path: pathValue,
            };
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, document.path]);

  const submitUpdateDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const path =
        document.path && typeof document.path === "number"
          ? document.path.toString()
          : typeof document.path === "object"
          ? document.path.value.toString()
          : "0";

      const file =
        typeof document.document === "string"
          ? document.document
          : document.document && typeof document.document === "object"
          ? document.document?.rawFile
          : "";

      const type =
        document.document && typeof document.document === "object"
          ? document.document.rawFile.type
          : document.type;

      const formData = new FormData();
      formData.append("name", document.name);
      formData.append("description", document.description);
      formData.append("path", path);
      formData.append("document", file);
      formData.append("type", type);
      formData.append("_method", "PATCH");

      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: updatedDocument } = await axios.post(
          `${url}/hr/document/${props.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (updatedDocument.success) {
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

  const handleDocument = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "document") {
      const { files } = e.target as HTMLInputElement;

      if (!files || !files.length) return;

      const file = files[0];
      const url = URL.createObjectURL(file);

      setDocument((prev) => {
        return {
          ...prev,
          document: { rawFile: file, fileURL: url },
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

  const handlePaths = (destination: number, label: string) => {
    setDocument((prev) => {
      return {
        ...prev,
        path: { label, value: destination },
      };
    });
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

  React.useEffect(() => {
    getDocument();
  }, [getDocument]);

  React.useEffect(() => {
    getPaths();
  }, [getPaths]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
              p-4 t:p-8 z-50 bg-gradient-to-b from-accent-yellow/30 to-accent-purple/30 animate-fade"
    >
      <div className="w-full h-auto max-w-screen-t bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-yellow rounded-t-lg font-bold text-accent-blue">
          Update Document
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitUpdateDocument(e)}
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

          <Select
            id="path"
            activeSelect={activeSelect}
            label={
              document.path && typeof document.path === "object"
                ? document.path.label
                : "Home"
            }
            options={paths}
            placeholder="Path"
            required={true}
            toggleSelect={toggleSelect}
            value={
              document.path && typeof document.path === "object"
                ? document.path.value
                : typeof document.path === "number"
                ? document.path
                : 0
            }
            onChange={handlePaths}
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
            ) : document.document && typeof document.document === "string" ? (
              <div className="p-2 w-full rounded-md border-2 bg-white flex flex-col items-center justify-center bg-center bg-cover relative">
                <div className="w-full flex flex-row items-center justify-start gap-2">
                  <Link
                    href={document.document}
                    target="_blank"
                    className="flex flex-row items-center justify-center gap-2 group transition-all hover:underline underline-offset-2"
                  >
                    <div className="aspect-square p-2.5 rounded-sm bg-accent-blue/50">
                      <AiFillFilePdf className="text-white text-2xl" />
                    </div>
                    <span className="truncate text-sm">View Document?</span>
                  </Link>
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
          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-yellow text-accent-blue mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDocument;
