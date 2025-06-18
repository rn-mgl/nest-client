import { ModalInterface } from "@/src/interface/ModalInterface";
import React from "react";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import Input from "../../form/Input";
import axios from "axios";
import { useSession } from "next-auth/react";
import { getCSRFToken } from "@/src/utils/token";
import { useRouter } from "next/navigation";
import useShowPassword from "@/src/hooks/useShowPassword";

const ChangePassword: React.FC<ModalInterface> = (props) => {
  const [password, setPassword] = React.useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const { showPassword, handleShowPassword } = useShowPassword();

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const router = useRouter();

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPassword((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/admin/auth/change_password`,
          { ...password },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          router.push("/control/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 z-50 bg-gradient-to-b from-accent-blue/30 
                to-accent-yellow/30 animate-fade flex flex-col items-center justify-center p-4 t:p-8"
    >
      <div className="w-full h-auto bg-neutral-100 max-w-(--breakpoint-t) shadow-md rounded-lg">
        <div className="w-full p-4 flex flex-row items-center justify-between bg-accent-yellow rounded-t-lg text-accent-blue font-bold">
          Change Password
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/30 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitChangePassword(e)}
          className="w-full flex flex-col items-center justify-start gap-4 p-4"
        >
          <Input
            id="current_password"
            onChange={handlePassword}
            placeholder="Current Password"
            required={true}
            type={showPassword.current_password ? "text" : "password"}
            value={password.current_password}
            label={true}
            icon={
              showPassword.current_password ? (
                <IoEyeOff
                  onClick={() => handleShowPassword("current_password")}
                  className="cursor-pointer"
                />
              ) : (
                <IoEye
                  onClick={() => handleShowPassword("current_password")}
                  className="cursor-pointer"
                />
              )
            }
          />

          <Input
            id="new_password"
            onChange={handlePassword}
            placeholder="New Password"
            required={true}
            type={showPassword.new_password ? "text" : "password"}
            value={password.new_password}
            label={true}
            icon={
              showPassword.new_password ? (
                <IoEyeOff
                  onClick={() => handleShowPassword("new_password")}
                  className="cursor-pointer"
                />
              ) : (
                <IoEye
                  onClick={() => handleShowPassword("new_password")}
                  className="cursor-pointer"
                />
              )
            }
          />

          <Input
            id="new_password_confirmation"
            onChange={handlePassword}
            placeholder="Confirm New Password"
            required={true}
            type={showPassword.new_password_confirmation ? "text" : "password"}
            value={password.new_password_confirmation}
            label={true}
            icon={
              showPassword.new_password_confirmation ? (
                <IoEyeOff
                  onClick={() =>
                    handleShowPassword("new_password_confirmation")
                  }
                  className="cursor-pointer"
                />
              ) : (
                <IoEye
                  onClick={() =>
                    handleShowPassword("new_password_confirmation")
                  }
                  className="cursor-pointer"
                />
              )
            }
          />

          <button className="w-full p-2 rounded-md bg-accent-yellow font-bold text-accent-blue mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
