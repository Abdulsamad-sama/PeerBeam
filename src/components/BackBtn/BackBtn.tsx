"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaCaretLeft } from "react-icons/fa6";

const BackBtn = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="absolute top-2 md:top-8 left-2 text-black rounded-full bg-gray-200 hover:bg-gray-300 p-2 flex items-center gap-2 shadow"
      aria-label="Back to Home"
    >
      <FaCaretLeft className="text-xl" />
      <span className="font-semibold">Back</span>
    </button>
  );
};

export default BackBtn;
