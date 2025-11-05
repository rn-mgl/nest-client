import { DocumentInterface } from "@/src/interface/DocumentInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios, { isAxiosError } from "axios";

import Input from "@/src/components/global/form/Input";
import Select from "@/src/components/global/form/Select";
import TextArea from "@/src/components/global/form/TextArea";
import { useToasts } from "@/src/context/ToastContext";
import useIsLoading from "@/src/hooks/useIsLoading";
import { isCloudFileSummary, isRawFileSummary } from "@/src/utils/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { IoAdd, IoClose, IoText } from "react-icons/io5";
import LogoLoader from "../global/loader/LogoLoader";

const EditDocument: React.FC<ModalInterface> = (props) => {
  const [document, setDocument] = React.useState<DocumentInterface>({
    title: "",
    description: "",
    document: null,
    path: 0,
    created_by: 0,
  });

  const [paths, setPaths] = React.useState<{ label: string; value: number }[]>(
    []
  );

  const { addToast } = useToasts();

  const documentRef = React.useRef<HTMLInputElement | null>(null);

  const { isLoading, handleIsLoading } = useIsLoading();

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const getAvailablePaths = React.useCallback(
    async (folder: number) => {
      try {
        if (user?.token) {
          const { data: responseData } = await axios.get<{
            paths: { label: string; value: number }[];
          }>(`${url}/folder/resource/paths`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            params: { folder },
            withCredentials: true,
          });

          if (responseData.paths) {
            const pathValue = responseData.paths.find(
              (path) => path.value === folder
            );
            setPaths(responseData.paths);
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

        if (isAxiosError(error)) {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the folder paths are being retrieved";
          addToast("Folder Error", message, "error");
        }
      }
    },
    [url, user?.token, addToast]
  );

  const getDocument = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          document: DocumentInterface;
        }>(`${url}/document/resource/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        });

        if (responseData.document) {
          setDocument(responseData.document);
          // get all paths after successfully getting document info
          const path =
            typeof responseData.document?.path === "number"
              ? responseData.document.path
              : 0;

          await getAvailablePaths(path);
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the document data is being retrieved";
        addToast("Document Error", message, "error");
      }
    }
  }, [url, user?.token, props.id, getAvailablePaths, addToast]);

  const submitUpdateDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      handleIsLoading(true);
      const path =
        document.path && typeof document.path === "number"
          ? document.path.toString()
          : typeof document.path === "object"
          ? document.path.value.toString()
          : "0";

      let file = null;

      if (isRawFileSummary(document.document)) {
        file = document.document.rawFile;
      } else if (isCloudFileSummary(document.document)) {
        file = JSON.stringify(document.document);
      }

      const formData = new FormData();
      formData.append("title", document.title);
      formData.append("description", document.description);
      formData.append("path", path);
      formData.append("document", file ?? "");
      formData.append("_method", "PATCH");

      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: updatedDocument } = await axios.post(
          `${url}/document/resource/${props.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (updatedDocument.success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }
          addToast(
            "Document Updated",
            `${document.title} as been updated.`,
            "success"
          );
          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the document data is being updated";
        addToast("Document Error", message, "error");
      }
    } finally {
      handleIsLoading(false);
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

  const handlePaths = (destination: number | string, label: string) => {
    setDocument((prev) => {
      return {
        ...prev,
        path: { label, value: Number(destination) },
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

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
              p-4 t:p-8 z-50 bg-linear-to-b from-accent-yellow/30 to-accent-purple/30 animate-fade"
    >
      {isLoading ? <LogoLoader /> : null}
      <div className="w-full h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col">
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
          className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 t:p-4"
        >
          <Input
            label={true}
            id="title"
            name="title"
            onChange={handleDocument}
            placeholder="Title"
            required={true}
            type="text"
            value={document.title}
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

          <Select
            id="path"
            name="path"
            label={true}
            options={paths}
            placeholder="Path"
            required={true}
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
            {isRawFileSummary(document.document) ? (
              <div className="p-2 w-full rounded-md border-2 bg-white flex flex-col items-center justify-center bg-center bg-cover relative">
                <div className="w-full flex flex-row items-center justify-start gap-2">
                  <div className="aspect-square p-2.5 rounded-xs bg-accent-blue/50">
                    <AiFillFilePdf className="text-white text-2xl" />
                  </div>
                  <p className="truncate text-sm">
                    {document.document.rawFile.name}
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
            ) : isCloudFileSummary(document.document) ? (
              <div className="p-2 w-full rounded-md border-2 bg-white flex flex-col items-center justify-center bg-center bg-cover relative">
                <div className="w-full flex flex-row items-center justify-start gap-2">
                  <Link
                    href={document.document.url}
                    target="_blank"
                    className="flex flex-row items-center justify-center gap-2 group transition-all hover:underline underline-offset-2"
                  >
                    <div className="aspect-square p-2.5 rounded-xs bg-accent-blue/50">
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
                  accept="application/pdf"
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
          <button
            disabled={isLoading}
            className="w-full font-bold text-center rounded-md p-2 bg-accent-yellow text-accent-blue mt-2"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditDocument;
