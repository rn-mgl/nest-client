import React from "react";

export default function useAlert<T>() {
  const [confirmAction, setConfirmAction] = React.useState<{
    id: number;
    action?: T;
  }>({ id: 0 });

  const handleConfirmAction = (id: number, action?: T) => {
    setConfirmAction({ id, action });
  };

  return { confirmAction, handleConfirmAction };
}
