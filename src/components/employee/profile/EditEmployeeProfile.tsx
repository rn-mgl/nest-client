"use client";

import { ModalInterface } from "@/src/interface/ModalInterface";
import { ProfileInterface } from "@/src/interface/ProfileInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { IoClose, IoImage, IoText, IoTrash } from "react-icons/io5";
import Input from "@/form/Input";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

const EditEmployeeProfile: React.FC<
  ModalInterface & { profile: UserInterface & ProfileInterface }
> = (props) => {
  const [profile, setProfile] = React.useState<
    UserInterface & ProfileInterface
  >(props.profile);

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const imageRef = React.useRef<HTMLInputElement>(null);

  const handleProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    setProfile((prev) => {
      if (files) {
        if (files.length < 1) return prev;

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

  const submitUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const formData = new FormData();
        formData.append("first_name", profile.first_name);
        formData.append("last_name", profile.last_name);
        formData.append(
          "image",
          profile.image && typeof profile.image === "object"
            ? profile.image.rawFile
            : typeof profile.image === "string"
            ? profile.image
            : ""
        );
        formData.append("_method", "PATCH");

        const { data: responseData } = await axios.post(
          `${url}/employee/profile/${user.current}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
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
          onSubmit={(e) => submitUpdateProfile(e)}
          className="w-full p-2 rounded-b-md bg-neutral-100 flex flex-col items-center justify-start gap-4 t:p-4"
        >
          <div className="w-40 aspect-square bg-accent-blue rounded-full border-8 border-accent-yellow flex flex-col items-center justify-center relative overflow-hidden">
            {typeof profile.image === "object" && profile.image?.rawFile ? (
              <Image
                alt="Profile"
                width={300}
                height={300}
                src={profile.image.fileURL}
                className="absolute w-full"
              />
            ) : typeof profile.image === "string" && profile.image !== "" ? (
              <Image
                alt="Profile"
                width={300}
                height={300}
                src={profile.image}
                className="absolute w-full"
              />
            ) : null}
          </div>

          <div className="w-full flex flex-row items-center justify-between">
            <label htmlFor="image" className="text-accent-blue cursor-pointer">
              <input
                type="file"
                accept="image/*"
                id="image"
                className="hidden"
                name="image"
                ref={imageRef}
                onChange={handleProfile}
              />

              <IoImage />
            </label>

            {typeof profile.image === "object" ||
            typeof profile.image === "string" ? (
              <button
                onClick={removeImage}
                type="button"
                className="text-red-600 cursor-pointer"
              >
                <IoTrash />
              </button>
            ) : null}
          </div>

          <Input
            id="first_name"
            name="first_name"
            onChange={handleProfile}
            placeholder="First Name"
            required={true}
            type="text"
            value={profile.first_name}
            icon={<IoText />}
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
            icon={<IoText />}
            label={true}
          />

          <button className="p-2 rounded-md bg-accent-yellow text-accent-blue font-bold w-full mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeProfile;
