import React from "react";
import Link from "next/link";
import BackBtn from "@/components/BackBtn/BackBtn";

const page = () => {
  return (
    <div className="flex gap-2 justify-around items-center h-full text-white">
      <BackBtn />
      <Link
        href="/connect/sender"
        className="bg-gray-800 p-4 rounded-2xl text-2xl"
      >
        Create a room
      </Link>
      <Link
        href="/connect/receiver"
        className="bg-gray-800 p-4 rounded-2xl text-2xl"
      >
        Join a room
      </Link>
    </div>
  );
};

export default page;
