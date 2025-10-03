"use client";

import Input from "@/form/Input";
import { useToasts } from "@/src/context/ToastContext";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import { isCloudFileSummary, isRawFileSummary } from "@/src/utils/utils";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose, IoImage, IoPerson, IoTrash } from "react-icons/io5";

const EditAdminProfile: React.FC<ModalInterface> = (props) => {
  const [profile, setProfile] = React.useState<UserInterface>({
    first_name: "",
    last_name: "",
    email: "",
    email_verified_at: "",
    image: null,
    password: "",
    id: 0,
    verification_status: "Deactivated",
  });

  const { addToast } = useToasts();

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const userToken = user?.token;
  const userId = user?.current;
  const imageRef = React.useRef<HTMLInputElement>(null);

  const getProfile = React.useCallback(async () => {
    try {
      if (userToken) {
        const { data: responseData } = await axios.get(
          `${url}/admin/profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
            withCredentials: true,
          }
        );

        if (responseData.profile) {
          setProfile(responseData.profile);
        }
      }
    } catch (error) {
      console.log(error);

      let message =
        "An error occurred when the profile details are being retrieved.";

      if (isAxiosError(error)) {
        message = error.response?.data.message ?? error.message;
      }

      addToast("Profile Error", message, "error");
    }
  }, [userToken, userId, url, addToast]);

  const handleProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    setProfile((prev) => {
      if (files && files.length > 0) {
        const file = files[0];

        const url = URL.createObjectURL(file);

        const imageSet = { rawFile: file, fileURL: url };

        return {
          ...prev,
          [name]: imageSet,
        };
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
    });
  };

  const removeImage = () => {
    if (imageRef.current) {
      imageRef.current.files = null;
      imageRef.current.value = "";
    }

    setProfile((prev) => {
      return {
        ...prev,
        image: null,
      };
    });
  };

  const submitUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { token } = await getCSRFToken();

      const formData = new FormData();
      formData.set("first_name", profile.first_name);
      formData.set("last_name", profile.last_name);
      formData.set(
        "image",
        isRawFileSummary(profile.image) ? profile.image.rawFile : ""
      );
      formData.set("_method", "PATCH");

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/admin/profile/${userId}`,
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

        if (responseData.success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }

          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);

      let message =
        "An error occurred when the profile details are being updated.";

      if (isAxiosError(error)) {
        message = error.response?.data.message ?? error.message;
      }

      addToast("Profile Error", message, "error");
    }
  };

  React.useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
                  p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade"
    >
      <div className="w-full h-auto max-w-(--breakpoint-t) bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-yellow rounded-t-lg font-bold text-accent-blue">
          Edit Profile
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={submitUpdateProfile}
          className="w-full p-2 flex flex-col items-center justify-start gap-4 t:p-4"
        >
          <div className="w-full flex flex-col items-center justify-start gap-4">
            <div
              style={{
                backgroundImage: isCloudFileSummary(profile.image)
                  ? `url(${profile.image})`
                  : isRawFileSummary(profile.image)
                  ? `url(${profile.image.fileURL})`
                  : "",
              }}
              className="w-40 bg-center bg-cover aspect-square bg-accent-blue border-8 border-accent-yellow rounded-full overflow-hidden flex flex-col items-center justify-center relative"
            ></div>

            <div className="w-full flex flex-row items-center justify-between">
              <label
                className="text-accent-blue cursor-pointer"
                htmlFor="image"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  name="image"
                  id="image"
                  onChange={(e) => handleProfile(e)}
                  ref={imageRef}
                />
                <p>
                  <IoImage />
                </p>
              </label>

              {isCloudFileSummary(profile.image) ||
              isRawFileSummary(profile.image) ? (
                <button
                  onClick={removeImage}
                  type="button"
                  className="text-red-600 cursor-pointer"
                >
                  <IoTrash />
                </button>
              ) : null}
            </div>
          </div>

          <Input
            id="first_name"
            name="first_name"
            onChange={handleProfile}
            placeholder="First Name"
            required={true}
            type="text"
            value={profile.first_name}
            icon={<IoPerson />}
            label={true}
          />

          <Input
            id="last_name"
            name="last_name"
            onChange={handleProfile}
            placeholder="Last Name"
            required={true}
            type="text"
            value={profile.last_name}
            icon={<IoPerson />}
            label={true}
          />

          <button className="mt-2 p-2 rounded-md bg-accent-yellow text-accent-blue font-bold w-full">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAdminProfile;
