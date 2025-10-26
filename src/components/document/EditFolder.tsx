import useSelect from "@/src/hooks/useSelect";
import { FolderInterface } from "@/src/interface/DocumentInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios, { isAxiosError } from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoClose, IoText } from "react-icons/io5";
import Input from "@/src/components/global/form/Input";
import Select from "@/src/components/global/form/Select";
import { useToasts } from "@/src/context/ToastContext";

const EditFolder: React.FC<ModalInterface> = (props) => {
  const [folder, setFolder] = React.useState<FolderInterface>({
    title: "",
    path: 0,
    created_by: 0,
  });
  const [paths, setPaths] = React.useState<{ label: string; value: number }[]>(
    []
  );
  const { addToast } = useToasts();
  const { activeSelect, toggleSelect } = useSelect();

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFolder((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handlePaths = (destination: number, label: string) => {
    setFolder((prev) => {
      return {
        ...prev,
        path: { label, value: destination },
      };
    });
  };

  const getAvailablePaths = React.useCallback(
    async (folderId: number, folderPath: number) => {
      try {
        if (user?.token) {
          const { data: folders } = await axios.get<{
            paths: { label: string; value: number }[];
          }>(`${url}/folder/resource/paths`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            params: { folder: folderId },
            withCredentials: true,
          });

          if (folders.paths) {
            // find the path that the folder currently uses for ui rendering of label and value
            const pathValue = folders.paths.find(
              (path) => path.value === folderPath
            );

            // do not include the current folder as another available path
            const availablePaths = folders.paths.filter(
              (path) => path.value !== props.id
            );

            setFolder((prev) => {
              return {
                ...prev,
                path: pathValue,
              };
            });

            setPaths(availablePaths);
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
    [url, user?.token, props.id, addToast]
  );

  const getFolder = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          folder: FolderInterface;
        }>(`${url}/folder/resource/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        });

        if (responseData.folder) {
          setFolder(responseData.folder);

          // get the paths available if you will move this current folder to another folder
          const folderId =
            typeof responseData.folder.id === "number"
              ? responseData.folder.id
              : 0;

          // pass the retrieved folder path for rendering
          const folderPath =
            typeof responseData.folder.path === "number"
              ? responseData.folder.path
              : 0;

          await getAvailablePaths(folderId, folderPath);
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the folder data is being retrieved";
        addToast("Folder Error", message, "error");
      }
    }
  }, [url, user?.token, props.id, getAvailablePaths, addToast]);

  const submitUpdateFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (typeof folder.path === "object" && folder.path.value === folder.id) {
        return;
      }

      if (token && user?.token) {
        const { data: updatedFolder } = await axios.patch(
          `${url}/folder/resource/${props.id}`,
          {
            title: folder.title,
            path:
              typeof folder.path === "number"
                ? folder.path
                : typeof folder.path === "object"
                ? folder.path.value
                : 0,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (updatedFolder.success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }
          addToast(
            "Folder Updated",
            `${folder.title} has been updated.`,
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
          "An error occurred when the folder data is being updated";

        addToast("Folder Error", message, "error");
      }
    }
  };

  React.useEffect(() => {
    getFolder();
  }, [getFolder]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
            p-4 t:p-8 z-50 bg-linear-to-b from-accent-yellow/30 to-accent-purple/30 animate-fade"
    >
      <div className="w-full h-auto max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-yellow rounded-t-lg font-bold text-accent-blue">
          Update Folder
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitUpdateFolder(e)}
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

          <Select
            id="path"
            name="path"
            activeSelect={activeSelect}
            onChange={handlePaths}
            options={paths}
            placeholder="Path"
            required={true}
            toggleSelect={toggleSelect}
            label={
              folder.path && typeof folder.path === "object"
                ? folder.path.label
                : "Home"
            }
            value={
              folder.path && typeof folder.path === "object"
                ? folder.path.value
                : 0
            }
          />

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-yellow text-accent-blue mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFolder;
