"use client";
import { IoAdd } from "react-icons/io5";

const Folder = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div
        className="w-full flex flex-col items-center justify-start max-w-screen-l-l p-2
      t:items-start t:p-4 gap-4 t:gap-8"
      >
        <div className="w-full flex flex-col items-center justify-start gap-2 t:flex-row">
          <button
            // onClick={handleCanCreateDocument}
            className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                      gap-2 t:w-fit t:px-4 transition-all"
          >
            Create Document
            <IoAdd className="text-lg" />
          </button>

          <button
            // onClick={handleCanCreateFolder}
            className="border-2 border-accent-blue text-accent-blue w-full p-1.75 rounded-md font-bold flex flex-row items-center justify-center 
                      gap-2 t:w-fit t:px-4 transition-all bg-white"
          >
            Create Folder
            <IoAdd className="text-lg" />
          </button>
        </div>

        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {/* {mappedDocuments} */}
        </div>
      </div>
    </div>
  );
};

export default Folder;
