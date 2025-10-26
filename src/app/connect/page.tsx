import React from "react";
import Link from "next/link";
import BackBtn from "@/components/BackBtn/BackBtn";
import { io } from "socket.io-client";

// Assuming you have a socket instance created and passed down as a prop or context
// If not, you can create a new socket instance here
const page = () => {
  
  return (
    <div className="flex gap-2 justify-around items-center h-full text-white">
      <BackBtn />
      <Link
        href="/connect/sender"
        className="bg1-color p-4 rounded-2xl text-2xl"
      >
        Create a room
      </Link>
      <Link
        href="/connect/receiver"
        className="bg1-color p-4 rounded-2xl text-2xl"
      >
        Join a room
      </Link>
    </div>
  );
};

export default page;
