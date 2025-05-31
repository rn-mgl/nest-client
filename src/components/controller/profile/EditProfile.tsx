"use client";

import { ModalInterface } from "@/src/interface/ModalInterface";
import { ProfileInterface } from "@/src/interface/ProfileInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose, IoMail, IoPerson } from "react-icons/io5";
import Input from "../../form/Input";

const EditAdminProfile: React.FC<ModalInterface> = (props) => {
  const [profile, setProfile] = React.useState<
    UserInterface & ProfileInterface
  >({
    user_id: 0,
    first_name: "",
    last_name: "",
    email: "",
    email_verified_at: "",
    image: "",
    password: "",
    title: "",
    department: "",
    phone_number: "",
  });

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const currentUser = user?.current;

  const handleProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProfile((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const getProfile = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/admin/profile/${currentUser}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.profile) {
          setProfile(responseData.profile);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentUser, user?.token, url]);

  const submitUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.patch(
          `${url}/admin/profile/${currentUser}`,
          { ...profile },
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
          className="w-full p-4 flex flex-col items-center justify-start gap-4"
        >
          <Input
            id="first_name"
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
            onChange={handleProfile}
            placeholder="Last Name"
            required={true}
            type="text"
            value={profile.last_name}
            icon={<IoPerson />}
            label={true}
          />

          <Input
            id="email"
            onChange={handleProfile}
            placeholder="Email"
            required={true}
            type="email"
            value={profile.email}
            icon={<IoMail />}
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
