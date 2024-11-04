"use client";
import CreateHR from "@/src/components/controller/hr/CreateHR";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoEllipsisVertical, IoShieldCheckmark } from "react-icons/io5";
import { BaseUser as HRInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import useGlobalContext from "@/src/utils/context";
import axios from "axios";
import { getCookie } from "cookies-next";

const HumanResource = () => {
  const [hrs, setHrs] = React.useState<Array<HRInterface>>();
  const [canCreateHR, setCanCreateHR] = React.useState(false);
  const { data } = useSession({ required: true });
  const user = data?.user;
  const { url } = useGlobalContext();

  const handleCanCreateHR = () => {
    setCanCreateHR((prev) => !prev);
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

  const mappedHRs = hrs?.map((hr) => {
    return (
      <div
        key={hr.id}
        className="w-full p-4 rounded-md bg-neutral-100 flex flex-row items-start justify-start gap-4"
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
            ) : null}{" "}
            {hr.email}
          </p>
        </div>
        <button className="p-2 text-xs hover:bg-neutral-200 rounded-full transition-all">
          <IoEllipsisVertical />{" "}
        </button>
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
