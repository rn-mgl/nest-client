"use client";

import ChangePassword from "@/src/components/admin/profile/ChangePassword";
import EditAdminProfile from "@/src/components/admin/profile/EditAdminProfile";
import { ProfileInterface } from "@/src/interface/ProfileInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { IoLockClosed, IoLockOpen, IoMail, IoPencil } from "react-icons/io5";

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
  const [canChangePassword, setCanChangePassword] = React.useState(false);

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

  const handleCanChangePassword = () => {
    setCanChangePassword((prev) => !prev);
  };

  React.useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <div className="w-full flex flex-col items-center justify-start h-full">
      {canEditProfile ? (
        <EditAdminProfile
          profile={profile}
          toggleModal={handleCanEditProfile}
          refetchIndex={getProfile}
        />
      ) : null}

      {canChangePassword ? (
        <ChangePassword toggleModal={handleCanChangePassword} />
      ) : null}
      <div className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2 t:p-4 t:items-start">
        {/* profile container */}
        <div className="w-full grid grid-cols-1 t:grid-cols-2 gap-4 l-l:grid-cols-3">
          <div className="w-full rounded-md bg-accent-blue flex flex-col items-center justify-center gap-2 p-4">
            {/* image */}
            <div className="rounded-full w-24 h-24 bg-accent-purple border-8 border-white flex flex-col items-center justify-center">
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

            {/* profile */}
            <div className="w-full flex flex-col items-center justify-start text-white">
              {/* name and email */}
              <div className="flex flex-col items-center justify-center gap-2 text-center">
                <p className="font-extrabold text-lg truncate w-full">
                  {profile.first_name} {profile.last_name}
                </p>
                <div className="flex items-center justify-center gap-1 text-xs opacity-70 font-light t:text-sm">
                  <span>
                    <IoMail />
                  </span>
                  <span>{profile.email}</span>
                </div>
              </div>

              <div className="w-full flex flex-row items-center justify-between">
                <button
                  onClick={handleCanEditProfile}
                  title="Edit Profile"
                  className="p-2 rounded-md bg-accent-blue"
                >
                  <IoPencil />
                </button>

                <button
                  onClick={handleCanChangePassword}
                  title="Change Password"
                  className="p-2 rounded-md bg-accent-blue"
                >
                  {canChangePassword ? <IoLockOpen /> : <IoLockClosed />}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full bg-neutral-200 rounded-md"></div>
          <div className="w-full bg-neutral-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
