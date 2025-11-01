"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";

const BackBtn = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="absolute top-2 md:top-5 left-14 rounded-full hover:text-gray-300 hover:scale-120 flex items-center shadow-2xl transition-transform duration-200 ease-in-out cursor-pointer"
      aria-label="Go Back"
    >
      <FaArrowLeftLong className="text-2xl" />
    </button>
  );
};

export default BackBtn;
