import { ModalInterface } from "@/src/interface/ModalInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";

const Log: React.FC<ModalInterface & { logType: "in" | "out" }> = ({
  id,
  logType,
  toggleModal,
  refetchIndex,
}) => {
  const [percentage, setPercentage] = React.useState(0);
  const [status, setStatus] = React.useState<"base" | "logging" | "failed">(
    "base"
  );

  const timerRef = React.useRef<NodeJS.Timeout>();

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const handleHold = () => {
    timerRef.current = setInterval(() => {
      setPercentage((prev) => prev + 1);
    }, 20);
  };

  const removeHold = () => {
    clearInterval(timerRef.current);
    if (percentage !== 100) {
      setPercentage(0);
    }
  };

  const submitLog = React.useCallback(async () => {
    setStatus("logging");
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: logged } = await axios.post(
          `${url}/employee/attendance`,
          { type: logType, attendance_id: id },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
            withCredentials: true,
          }
        );

        if (logged.success) {
          toggleModal();
          if (refetchIndex) {
            setPercentage(0);
            refetchIndex();
          }
        }
      }
    } catch (error) {
      setStatus("failed");
      console.log(error);
    }
  }, [url, user?.token, logType, refetchIndex, toggleModal, id]);

  React.useEffect(() => {
    if (percentage === 100) {
      clearInterval(timerRef.current);
      setPercentage(100);
      submitLog();
    }
  }, [percentage, submitLog]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
                p-4 t:p-8 z-50 bg-gradient-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade"
    >
      <div className="w-full h-auto max-w-screen-l-s bg-neutral-100 shadow-md rounded-lg ">
        <div
          className={`w-full flex flex-row items-center justify-between p-4  rounded-t-lg font-bold 
            ${
              logType === "in"
                ? "bg-accent-blue text-accent-yellow"
                : "bg-red-600 text-white"
            }`}
        >
          Log Attendance
          <button
            onClick={toggleModal}
            className={`p-2 rounded-full  transition-all text-xl
              ${
                logType === "in"
                  ? "hover:bg-accent-yellow/20"
                  : "hover:bg-accent-blue/20"
              }`}
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full p-4 rounded-b-md flex flex-col items-center justify-start gap-4">
          <p className="text-center font-bold">
            Hold the button to log {logType}.
          </p>

          {status === "base" ? (
            <button
              onMouseDown={handleHold}
              onTouchStart={handleHold}
              onMouseUp={removeHold}
              onMouseLeave={removeHold}
              onTouchEnd={removeHold}
              onTouchCancel={removeHold}
              className={`w-full font-bold text-center rounded-md p-2 mt-2 capitalize
                 ${
                   logType === "in"
                     ? "bg-accent-blue text-accent-yellow"
                     : "bg-red-600 text-white"
                 }`}
            >
              Log {logType}
            </button>
          ) : status === "logging" ? (
            <div>Logging</div>
          ) : (
            <div className="capitalize">{status}</div>
          )}

          <div className="w-full rounded-full h-2 bg-neutral-200 relative flex flex-col items-start justify-center">
            <div
              style={{ width: `${percentage}%` }}
              className={`absolute bg-gradient-to-r transition-all rounded-full w-0 h-2
                 ${
                   logType === "in"
                     ? "from-accent-blue to-accent-green"
                     : "from-red-500 to-orange-500"
                 }`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Log;
