"use client";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import ChangePassword from "@/src/components/hr/profile/ChangePassword";
import EditHRProfile from "@/src/components/hr/profile/EditHRProfile";
import { UserInterface } from "@/src/interface/UserInterface";
import { isCloudFileSummary } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { IoLockClosed, IoMail, IoPencil } from "react-icons/io5";

const Profile = () => {
  const [profile, setProfile] = React.useState<UserInterface>({
    email: "",
    email_verified_at: "",
    first_name: "",
    last_name: "",
    id: 0,
    image: null,
    password: "",
    verification_status: "Deactivated",
  });
  const [canEditProfile, setCanEditProfile] = React.useState(false);
  const [canChangePassword, setCanChangePassword] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const currentUser = user?.current ?? 0;

  const getProfile = React.useCallback(
    async (controller?: AbortController) => {
      startTransition(async () => {
        try {
          if (user?.token) {
            const { data: responseData } = await axios.get(
              `${url}/hr/profile/${currentUser}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
                withCredentials: true,
                signal: controller?.signal,
              }
            );

            if (responseData.profile) {
              setProfile(responseData.profile);
            }
          }
        } catch (error) {
          console.log(error);
        }
      });
    },
    [url, user?.token, currentUser]
  );

  const handleCanEditProfile = () => {
    setCanEditProfile((prev) => !prev);
  };

  const handleCanChangePassword = () => {
    setCanChangePassword((prev) => !prev);
  };

  React.useEffect(() => {
    const controller = new AbortController();

    getProfile(controller);

    return () => {
      controller.abort();
    };
  }, [getProfile]);

  if (isPending) {
    return <PageSkeletonLoader />;
  }

  return (
    <div className="w-full flex flex-col items-center justify-start h-full">
      {canEditProfile ? (
        <EditHRProfile
          toggleModal={handleCanEditProfile}
          refetchIndex={getProfile}
        />
      ) : null}
      {canChangePassword ? (
        <ChangePassword toggleModal={handleCanChangePassword} />
      ) : null}
      <div className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2 t:p-4 t:items-start gap-4">
        {/* profile container */}
        <div className="w-full grid">
          <div className="w-full h-auto rounded-md bg-accent-blue p-4 flex flex-col items-center justify-start gap-2">
            {/* image */}
            <div className="w-24 h-24 rounded-full bg-accent-purple border-8 border-white flex flex-col items-center justify-center relative overflow-hidden">
              {isCloudFileSummary(profile.image) ? (
                <Image
                  src={profile.image.url}
                  alt="profile"
                  width={200}
                  height={200}
                  className="absolute w-full"
                />
              ) : null}
            </div>

            {/* profile */}
            <div className="w-full flex flex-col items-center justify-start text-white">
              <div className="flex flex-col items-start justify-center gap-2 text-center">
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
