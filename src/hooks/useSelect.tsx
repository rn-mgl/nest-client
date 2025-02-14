import React from "react";

export default function useSelect() {
  const [activeSelect, setActiveSelect] = React.useState(false);

  const toggleSelect = () => {
    setActiveSelect((prev) => !prev);
  };

  return {
    activeSelect,
    toggleSelect,
  };
}
