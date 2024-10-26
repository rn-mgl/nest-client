import React from "react";

export default function useShowPassword() {
  const [showPassword, setShowPassword] = React.useState({
    password: false,
    password_confirmation: false,
  });

  const handleShowPassword = (field: "password" | "password_confirmation") => {
    setShowPassword((prev) => {
      return {
        ...prev,
        [field]: !prev[field],
      };
    });
  };

  return {
    showPassword,
    handleShowPassword,
  };
}
