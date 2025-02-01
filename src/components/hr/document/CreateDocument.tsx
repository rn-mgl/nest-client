import { DocumentInterface } from "@/src/interface/DocumentInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import React from "react";
import { AiOutlinePaperClip } from "react-icons/ai";
import { IoClose, IoText } from "react-icons/io5";
import Input from "../../form/Input";
import TextArea from "../../form/TextArea";
import Select from "../../form/Select";

const CreateDocument: React.FC<ModalInterface> = (props) => {
  const [document, setDocument] = React.useState<DocumentInterface>({
    name: "",
    description: "",
    type: "",
    path: 0,
    document: { rawFile: null, fileURL: "" },
  });
  const documentRef = React.useRef<HTMLInputElement | null>(null);

  const handleDocument = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setDocument((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
              p-4 t:p-8 z-50 bg-gradient-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade"
    >
      <div className="w-full h-auto max-w-screen-l-s bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-blue rounded-t-lg font-bold text-accent-yellow">
          Create Document
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          //   onSubmit={(e) => submitCreateLeaveType(e)}
          className="w-full h-full p-4 flex flex-col items-center justify-start gap-4"
        >
          <Input
            label={true}
            id="name"
            onChange={handleDocument}
            placeholder="Name"
            required={true}
            type="text"
            value={document.name}
            icon={<IoText />}
          />

          <TextArea
            label={true}
            required={true}
            id="description"
            onChange={handleDocument}
            placeholder="Description"
            value={document.description}
          />

          <Select
            activeSelect={true}
            label="Path"
            id="path"
            // onChange={handleDocument}
            options={[{ label: "home", value: 0 }]}
            required={true}
            placeholder="Path"
            // toggleSelect={() =>}
            value={0}
          />

          <div className="w-full flex flex-row items-center justify-between">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                name="certificate"
                className="hidden"
                ref={documentRef}
                onChange={(e) => handleDocument(e)}
              />

              <AiOutlinePaperClip className="text-accent-blue" />
            </label>
          </div>

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDocument;
