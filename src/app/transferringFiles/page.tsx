"use client";
import React from "react";
import { useFileProgress } from "@/context/FileProgressContext";
import BackBtn from "@/components/BackBtn/BackBtn";

const page = () => {
  const {files} = useFileProgress();
  return (
    <div className="relative  h-full dark:bg-gray-900">
      <BackBtn />
      <div className=" flex flex-col p-14 ">
        <h1 className="text-2xl md:text-3xl font-extrabold">Shared Files</h1>
        <ul className="flex flex-col pt-8 gap-4">
          {files.map((file, index) => (
            <li
              key={index}
              className={`flex justify-between border-1 border-gray-400 p-2 rounded-2xl`}
            >
              <p>{file.name}</p>
              <p>{file.progress.toFixed(2)}%</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default page;
