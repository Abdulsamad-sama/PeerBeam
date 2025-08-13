import Link from "next/link";
import React from "react";
import { IoNavigate } from "react-icons/io5";
import { FaCaretLeft } from "react-icons/fa6";

const BackToHomeBtn = () => {
  return (
    <Link
      href="/"
      className="absolute top-8 left-2 rounded-full bg-gray-200 hover:bg-gray-300 p-2 flex items-center gap-2 shadow"
      aria-label="Back to Home"
    >
      <FaCaretLeft className="text-xl" />
      <span className="font-semibold">Home</span>
    </Link>
  );
};

export default BackToHomeBtn;
