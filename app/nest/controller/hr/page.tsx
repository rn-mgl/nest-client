import { IoAdd } from "react-icons/io5";

const HumanResource = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-screen-l-l p-2
                  t:items-start t:p-4 gap-2"
      >
        <button
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-40 hover:brightness-90 transition-all"
        >
          Create HR
          <IoAdd className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default HumanResource;
