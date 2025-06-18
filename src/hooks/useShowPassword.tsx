import React from "react";

export default function useShowPassword() {
  const [showPassword, setShowPassword] = React.useState({
    password: false,
    password_confirmation: false,
    current_password: false,
    new_password: false,
    new_password_confirmation: false,
  });

  const handleShowPassword = (name: string) => {
    setShowPassword((prev) => {
      return {
        ...prev,
        [name]: !prev[name as keyof object],
      };
    });
  };

  return {
    showPassword,
    handleShowPassword,
  };
}
