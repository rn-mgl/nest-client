"use client";

import EditAdminProfile from "@/src/components/admin/profile/EditProfile";
import { ProfileInterface } from "@/src/interface/ProfileInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { IoMail, IoPencil } from "react-icons/io5";

const AdminProfile = () => {
  const [profile, setProfile] = React.useState<
    UserInterface & ProfileInterface
  >({
    user_id: 0,
    first_name: "",
    last_name: "",
    email: "",
    email_verified_at: "",
    image: null,
    password: "",
    title: "",
    department: "",
    phone_number: "",
  });
  const [canEditProfile, setCanEditProfile] = React.useState(false);

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const currentUser = user?.current; // to avoid rerendering on tab switching

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
  }, [url, user?.token, currentUser]);

  const handleCanEditProfile = () => {
    setCanEditProfile((prev) => !prev);
  };

  React.useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <div className="w-full flex flex-col items-center justify-start h-full">
      {canEditProfile ? (
        <EditAdminProfile
          toggleModal={handleCanEditProfile}
          id={currentUser}
          refetchIndex={getProfile}
        />
      ) : null}
      <div className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2 t:p-4 gap-4 t:gap-8">
        {/* banner */}
        <div className="w-full rounded-t-md aspect-[3/1] t:aspect-[4/1] l-s:aspect-[5/1] l-l:aspect-[6/1] bg-accent-blue flex items-start justify-end">
          <button onClick={handleCanEditProfile} className="p-2 text-white">
            <IoPencil />
          </button>
        </div>
        {/* profile */}
        <div className="w-full -translate-y-16 flex flex-col items-center justify-center gap-4 t:-translate-y-26 l-l:-translate-y-34 p-2 rounded-b-md">
          {/* image */}
          <div
            className="rounded-full w-24 h-24 bg-accent-purple border-8 border-white relative flex flex-col items-center justify-center t:w-34 t:h-34
                      l-l:w-44 l-l:h-44"
          >
            {typeof profile.image === "string" && profile.image !== "" ? (
              <div className="w-full h-full rounded-full flex flex-col items-center justify-center overflow-hidden relative">
                <Image
                  src={profile.image}
                  width={200}
                  height={200}
                  className="absolute w-full"
                  alt="profile"
                />
              </div>
            ) : null}
          </div>

          {/* name and email */}
          <div className="d-flex flex-col items-start justify-center gap-2 text-center">
            <p className="font-bold text-lg truncate w-full">
              {profile.first_name} {profile.last_name}
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 font-light">
              <span>
                <IoMail />
              </span>
              <span>{profile.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
