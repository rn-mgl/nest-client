import { FolderInterface } from "@/src/interface/DocumentInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import React from "react";
import { IoClose, IoText } from "react-icons/io5";
import Input from "@/src/components/global/form/Input";
import { getCSRFToken } from "@/src/utils/token";
import { useSession } from "next-auth/react";
import axios, { isAxiosError } from "axios";
import { useToasts } from "@/src/context/ToastContext";
import useIsLoading from "@/src/hooks/useIsLoading";
import LogoLoader from "../global/loader/LogoLoader";

const CreateFolder: React.FC<ModalInterface & { path: string | number }> = (
  props
) => {
  const [folder, setFolder] = React.useState<FolderInterface>({
    title: "",
    created_by: 0,
  });

  const { addToast } = useToasts();

  const { isLoading, handleIsLoading } = useIsLoading();

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const handleFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFolder((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitCreateFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      handleIsLoading(true);
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const {
          data: { success },
        } = await axios.post(
          `${url}/folder/resource`,
          { ...folder, path: props.path },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }
          addToast(
            "Folder Created",
            `${folder.title} has been created.`,
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
          "An error occurred when the folder is being created";
        addToast("Folder Error", message, "error");
      }
    } finally {
      handleIsLoading(false);
    }
  };

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
                p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade"
    >
      {isLoading ? <LogoLoader /> : null}
      <div className="w-full h-auto max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-blue rounded-t-lg font-bold text-accent-yellow">
          Create Folder
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitCreateFolder(e)}
          className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 t:p-4"
        >
          <Input
            label={true}
            id="title"
            name="title"
            onChange={handleFolder}
            placeholder="Title"
            required={true}
            type="text"
            value={folder.title}
            icon={<IoText />}
          />

          <button
            disabled={isLoading}
            className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFolder;
