"use client";
import Image from "next/image";
import { FaPlus } from "react-icons/fa6";
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
      className=" relative flex w- flex-col gap-8 items-center justify-center h-full"
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
      {/* Show selected file names */}
      {files.length > 0 && (
        <div className="mt-4 w-full max-w-md">
          <h2 className="font-semibold mb-2">Selected Files:</h2>
          <ul className="list-disc pl-5 text-gray-700">
            {files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="hidden sm:flex items-center text-center text-2xl text-gray-400 border-dashed border-gray-500 bg-white">
        <FaPlus className="mr-3" />
        <p className="font-bold cursor-default ">
          Drag and drop files here to send
        </p>
      </div>

      <div className="overflow-hidden flex items-center gap-4 h-10 p-4 border border-gray-500">
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
        <button type="button" className="">
          Send
        </button>
      )}
    </div>
  );
}
