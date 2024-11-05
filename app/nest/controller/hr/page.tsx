"use client";
import CreateHR from "@/src/components/controller/hr/CreateHR";
import { BaseUser as HRInterface } from "@/src/interface/UserInterface";
import useGlobalContext from "@/src/utils/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import {
  IoAdd,
  IoBan,
  IoEllipsisVertical,
  IoMail,
  IoShieldCheckmark,
} from "react-icons/io5";

const HumanResource = () => {
  const [hrs, setHrs] = React.useState<Array<HRInterface>>();
  const [canCreateHR, setCanCreateHR] = React.useState(false);
  const [activeHRMenu, setActiveHRMenu] = React.useState(0);

  const { data } = useSession({ required: true });
  const user = data?.user;
  const { url } = useGlobalContext();

  const handleCanCreateHR = () => {
    setCanCreateHR((prev) => !prev);
  };

  const handleActiveHRMenu = (id: number) => {
    setActiveHRMenu((prev) => (prev === id ? 0 : id));
  };

  const sendMail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const getAllHRs = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken(url);

      if (token && user?.token) {
        const {
          data: { hrs },
        } = await axios.get(`${url}/admin/hr`, {
          headers: {
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            Authorization: `Bearer ${user?.token}`,
          },
          withCredentials: true,
        });

        setHrs(hrs);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token]);

  const deactiveHR = async (id: number) => {
    try {
      const { token } = await getCSRFToken(url);

      if (token) {
        const { data: deactivated } = await axios.patch(
          `${url}/admin/hr/update/${id}`,
          {},
          {
            headers: {
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
          }
        );

        if (deactivated.success) {
          getAllHRs();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedHRs = hrs?.map((hr) => {
    return (
      <div
        key={hr.id}
        className="w-full p-4 rounded-md bg-neutral-100 flex flex-row items-start justify-start gap-4 relative"
      >
        <div className="w-12 h-12 min-w-12 min-h-12 bg-gradient-to-b from-accent-yellow to-accent-blue rounded-full"></div>
        <div className="flex flex-col items-start justify-center gap-1 w-full overflow-hidden">
          <p
            title={`${hr.first_name} ${hr.last_name} `}
            className="font-bold truncate w-full"
          >
            {hr.first_name} {hr.last_name}
          </p>
          <p className="text-xs flex flex-row items-center justify-center gap-1">
            {hr.email_verified_at ? (
              <IoShieldCheckmark
                className="text-accent-blue"
                title={`Verified at: ${hr.email_verified_at}`}
              />
            ) : null}
            {hr.email}
          </p>
        </div>
        <button
          onClick={() => handleActiveHRMenu(hr.id)}
          className="p-2 text-xs hover:bg-neutral-200 rounded-full transition-all"
        >
          <IoEllipsisVertical
            className={`${
              activeHRMenu === hr.id ? "text-accent-blue" : "text-neutral-900"
            }`}
          />
        </button>

        {activeHRMenu === hr.id ? (
          <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
            <button
              onClick={() => sendMail(hr.email)}
              className="w-full p-1 rounded-sm text-sm hover:brightness-90 bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoMail className="text-accent-blue" />
              Mail
            </button>
            {hr.email_verified_at ? (
              <button
                onClick={() => deactiveHR(hr.id)}
                className="w-full p-1 rounded-sm text-sm hover:brightness-90 bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
              >
                <IoBan className="text-red-600" />
                Deactivate
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  });

  React.useEffect(() => {
    getAllHRs();
  }, [getAllHRs]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateHR ? (
        <CreateHR toggleModal={handleCanCreateHR} refetchIndex={getAllHRs} />
      ) : null}
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-screen-l-l p-2
                  t:items-start t:p-4 gap-4 t:gap-8"
      >
        <button
          onClick={handleCanCreateHR}
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-40 hover:brightness-90 transition-all"
        >
          Create HR
          <IoAdd className="text-lg" />
        </button>

        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedHRs}
        </div>
      </div>
    </div>
  );
};

export default HumanResource;
