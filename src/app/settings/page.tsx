"use client";
import React from "react";
import BackToHomeBtn from "@/components/Backtohomebtn/BackToHomeBtn";
import ChangeAvatar from "@/components/ChangeAvatar/ChangeAvatar";
import ChangeUserName from "@/components/ChangeUserName/ChangeUserName";
import ThemeBtn from "@/components/ThemeBtn/ThemeBtn";

const settings = () => {
  return (
    <div className="relative flex flex-col h-full p-4 pt-8">
      <BackToHomeBtn />
      <div>
        <h1 className="text-4xl text-center font-bold mb-4">
          PeerBeam
          <span className="italic text-xs text-gray-500">Version 1.0</span>
        </h1>
      </div>
      {/* <hr className=" " /> */}

      <div className="mt-4">
        <h2 className="text-sm italic">Edit your name</h2>
        <div className="border-1 rounded h-19 p-2">
          <ChangeUserName />
        </div>
      </div>

      {/* edit avatar */}
      <div className="mt-4">
        <h2 className="text-sm italic">Edit your avatar</h2>
        <div className="border-1 rounded h-19 p-2">
          <ChangeAvatar />
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-sm italic">Choose your Theme</h2>
        <div className="border-1 rounded h-19 p-2">
          <ThemeBtn />
        </div>
      </div>

      <div className="text-right mt-4 ">
        <button className=" border-1 rounded-2xl p-1.5 cursor-pointer bg-gray-200 hover:bg-gray-300 shadow">
          Clear History
        </button>
      </div>

      <div className="text-center italic text-xs text-gray-500 ">
        <h3>Peerbeem: version 1.0</h3>
      </div>
    </div>
  );
};

export default settings;
