"use client";

import { ModalInterface } from "@/src/interface/ModalInterface";
import { ProfileInterface } from "@/src/interface/ProfileInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { IoClose, IoImage, IoPerson, IoTrash } from "react-icons/io5";
import Input from "../../form/Input";

const EditAdminProfile: React.FC<
  ModalInterface & { profile: UserInterface & ProfileInterface }
> = (props) => {
  const [profile, setProfile] = React.useState<
    UserInterface & ProfileInterface
  >(props.profile);

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const currentUser = user?.current;
  const imageRef = React.useRef<HTMLInputElement>(null);

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

  const handleRemoveImage = () => {
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
      formData.append("first_name", profile.first_name);
      formData.append("last_name", profile.last_name);
      formData.append(
        "image",
        typeof profile.image === "object" && profile.image?.rawFile
          ? profile.image.rawFile
          : typeof profile.image === "string"
          ? profile.image
          : ""
      );
      formData.append("_method", "PATCH");

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/admin/profile/${currentUser}`,
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
    }
  };

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
          className="w-full p-4 flex flex-col items-center justify-start gap-4"
        >
          <div className="w-full flex flex-col items-center justify-start gap-4">
            <div className="w-40 aspect-square bg-accent-blue border-8 border-accent-yellow rounded-full bg-center bg-cover overflow-hidden flex flex-col items-center justify-center relative">
              {typeof profile.image === "object" && profile.image?.fileURL ? (
                <Image
                  src={profile.image.fileURL}
                  width={300}
                  height={300}
                  alt="profile"
                  className="absolute w-full"
                />
              ) : typeof profile.image === "string" && profile.image !== "" ? (
                <Image
                  src={profile.image}
                  width={300}
                  height={300}
                  alt="profile"
                  className="absolute w-full"
                />
              ) : null}
            </div>

            <div className="w-full flex flex-row items-center justify-between">
              <label className="text-accent-blue" htmlFor="image">
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

              {typeof profile.image === "object" ||
              typeof profile.image === "string" ? (
                <button
                  onClick={handleRemoveImage}
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
