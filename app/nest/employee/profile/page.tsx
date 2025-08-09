"use client";

import ChangePassword from "@/src/components/employee/profile/ChangePassword";
import EditEmployeeProfile from "@/src/components/employee/profile/EditEmployeeProfile";
import { ProfileInterface } from "@/src/interface/ProfileInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { IoLockClosed, IoMail, IoPencil } from "react-icons/io5";

const Profile = () => {
  const [profile, setProfile] = React.useState<
    UserInterface & ProfileInterface
  >({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    email_verified_at: "",
    phone_number: "",
    title: "",
    user_id: 0,
    image: "",
    password: "",
  });
  const [canEditProfile, setCanEditProfile] = React.useState(false);
  const [canChangePassword, setCanChangePassword] = React.useState(false);

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const currentUser = user?.current;

  const getProfile = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/profile/${currentUser}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
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
      {canChangePassword ? (
        <ChangePassword toggleModal={handleCanChangePassword} />
      ) : null}

      {canEditProfile ? (
        <EditEmployeeProfile
          profile={profile}
          toggleModal={handleCanEditProfile}
          refetchIndex={getProfile}
        />
      ) : null}
      <div className="w-full min-h-full h-auto flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2 t:p-4 t:items-start">
        <div className="w-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3 gap-4 items-start justify-start">
          <div className="w-full rounded-md bg-accent-blue p-4 flex flex-col items-center justify-start gap-2">
            {/* image */}
            <div className="w-24 h-24 rounded-full bg-accent-purple border-8 border-white flex flex-col items-center justify-center relative overflow-hidden">
              {typeof profile.image === "string" && profile.image !== "" ? (
                <Image
                  src={profile.image}
                  alt="profile"
                  width={200}
                  height={200}
                  className="absolute w-full"
                />
              ) : null}
            </div>

            {/* profile */}
            <div className="w-full flex flex-col items-center justify-start text-white">
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
                  className="p-2 rounded-md bg-accent-blue"
                  title="Edit Profile"
                >
                  <IoPencil />
                </button>

                <button
                  onClick={handleCanChangePassword}
                  className="p-2 rounded-md bg-accent-blue"
                  title="Change Password"
                >
                  <IoLockClosed />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full p-2 rounded-md bg-accent-green h-full"></div>
          <div className="w-full p-2 rounded-md bg-accent-yellow h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
