"use client";

import React from "react";

const Performance = () => {
  const [performances, setPerformances] = React.useState([]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-screen-l-l p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        Performance
      </div>
    </div>
  );
};

export default Performance;
