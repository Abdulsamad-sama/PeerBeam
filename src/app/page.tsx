"use client";
import Image from "next/image";
import { FaCaretRight, FaPlus } from "react-icons/fa6";
import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFile = (fileList: FileList) => {
    const selectedFiles = Array.from(fileList);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      alert(`Selected ${selectedFiles.length} file(s)`);
    } else {
      alert("No files selected");
    }
  };

  return (
    <div
      className=" relative flex flex-col gap-8 items-center justify-center h-full dark:bg-gray-900"
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add("border-blue-500");
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-blue-500");
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-blue-500");
        handleFile(e.dataTransfer.files);
      }}
    >
      {/* Show how many file is selected*/}
      {files.length > 0 && (
        <div className="relative w-38 h-38 p-4 text-center">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-8 border-l-8 border-gray-400 rounded-tl-2xl"></div>

          <div className="absolute top-0 right-0 w-8 h-8 border-t-8 border-r-8 border-gray-400 rounded-tr-2xl"></div>

          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-8 border-l-8 border-gray-400 rounded-bl-2xl"></div>

          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-8 border-r-8 border-gray-400 rounded-br-2xl"></div>

          <p className="text-center mt-8 font-extrabold text-6xl text-gray-500">
            {files.length}
          </p>
        </div>
      )}

      <div className="hidden sm:flex items-center text-center text-2xl text-gray-400 border-dashed border-gray-500 bg-white">
        <FaPlus className="mr-3" />
        <p className="font-bold cursor-default ">
          Drag and drop files here to send
        </p>
      </div>

      <div className=" relative overflow-hidden flex items-center gap-4 h-10 p-4 border border-gray-500 cursor-pointer">
        <input
          className="absolute opacity-0 border-2"
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              handleFile(e.target.files);
            }
          }}
        />
        <div className=" flex items-center">
          <FaPlus className="mr-1" />
          <p className="cursor-pointer ">Choose from files</p>
        </div>
      </div>

      {files.length > 0 && (
        <button
          type="button"
          className="absolute bottom-4 right-4 p-1 rounded-lg text-center bg-green-100 hover:bg-green-400 transition-colors"
        >
          Send
          <FaCaretRight className="ml-1 text-center inline-flex" />
        </button>
      )}
    </div>
  );
}
