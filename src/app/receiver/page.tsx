"use client";
import React from "react";
import BackBtn from "@/components/BackBtn/BackBtn";

const page = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <BackBtn />

      <form onSubmit={(e) => e.preventDefault()} className="">
        <input
          type="text"
          placeholder="Input sender id"
          className="border-2 rounded-2xl p-2 mb-4"
        />
      </form>
      <button
        type="submit"
        className=" rounded-2xl p-2 mb-4 bg1-color hover:bg-[#00ca79] hover:text-white active:text-amber-300 active:bg-[#00ca7985] transition-colors duration-300"
      >
        Connect
      </button>
      <hr className="my-6" />
      <span>
        <p>Input sender-id to connect</p>
      </span>
    </div>
  );
};

export default page;
