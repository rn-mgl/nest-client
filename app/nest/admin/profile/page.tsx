"use client";

import EditAdminProfile from "@/src/components/admin/profile/EditProfile";
import { ProfileInterface } from "@/src/interface/ProfileInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoMail, IoPencilSharp } from "react-icons/io5";

const AdminProfile = () => {
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
        <div className="w-full rounded-md aspect-[3/1] t:aspect-[4/1] l-l:aspect-[6/1] bg-gradient-to-br from-accent-green to-accent-blue"></div>
        {/* profile */}
        <div className="w-full -translate-y-16 flex flex-col items-center justify-center gap-4 t:-translate-y-20">
          <div className="rounded-full w-24 h-24 bg-accent-purple border-4 border-white relative flex flex-col items-center justify-center">
            <button
              className="absolute bottom-0 right-0 p-1 rounded-full bg-accent-yellow"
              onClick={handleCanEditProfile}
              title="Edit"
            >
              <IoPencilSharp />
            </button>
          </div>

          <div className="d-flex flex-col items-center justify-start gap-2 text-center w-full">
            <p className="font-bold text-xl truncate w-full">
              {profile.first_name} {profile.last_name}
            </p>
            <div className="w-full flex items-center justify-center gap-1 text-sm text-neutral-500 font-light">
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
