import React from "react";

export default function useConfirmAction<T>() {
  const [confirmAction, setConfirmAction] = React.useState<{
    id: number;
    action?: T;
  }>({ id: 0 });

  const handleConfirmAction = (id: number, action?: T) => {
    setConfirmAction({ id, action });
  };

  const cancelAction = () => {
    setConfirmAction({ id: 0 });
  };

  return { confirmAction, handleConfirmAction, cancelAction };
}
