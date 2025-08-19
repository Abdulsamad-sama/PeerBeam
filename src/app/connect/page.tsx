import BackToHomeBtn from "@/components/Backtohomebtn/BackToHomeBtn";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex gap-2 justify-around items-center h-full text-white">
      <BackToHomeBtn />
      <Link href="/sender" className="bg1-color p-4 rounded-2xl text-2xl">
        Create a room
      </Link>
      <Link href="/receiver" className="bg1-color p-4 rounded-2xl text-2xl">
        Join room
      </Link>
    </div>
  );
};

export default page;
