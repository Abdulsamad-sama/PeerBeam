"use client";

import React, { useState } from "react";
import Link from "next/link";
import Connected from "@/components/connected/connected";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import UserName from "@/components/UserName/UserName";
import { FaStar, FaUserCog, FaUserPlus } from "react-icons/fa";
import { BsExclamationCircleFill } from "react-icons/bs";

const Section = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const HandleInvite = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const shareData = {
      title: "Join me on this awesome site",
      text: "Send files or photos to your love ones without using mobile data",
      url: "https://localhost:3000",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log("Shared successfully");
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert(
          "sharing no supported. The link has been copied to your clipboard!"
        );
      }
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="relative hidden sm:flex flex-col h-full w-60 p-2 overflow-hidden bg-gray-200 dark:bg-gray-900 text-lg">
      {/* username/ information */}
      <header className="flex justify-around items-center border-b-2 border-gray-500 dark:border-gray-500 pb-2">
        <UserAvatar />
        <div className="flex flex-col justify-center gap-1">
          <UserName />
          <Connected />
        </div>
      </header>

      <div className=" relative flex flex-col h-full">
        <main className="flex flex-col gap-4">
          {/* connect */}
          <div className="mt-4 flex flex-col gap-4">
            <Link
              href="/"
              className="w-full cursor-pointer bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 hover:dark:bg-gray-600 rounded p-2"
            >
              Home
            </Link>

            <Link
              href="/connect"
              className="w-full cursor-pointer bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 hover:dark:bg-gray-600 rounded p-2"
            >
              Connect
            </Link>
          </div>
        </main>

        {/* Other information */}
        <footer className="absolute bottom-2 w-full px-2">
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="/settings"
                className="flex items-center gap-2 cursor-pointer"
              >
                <FaUserCog />
                Settings
              </Link>
            </li>
            <li>
              <button
                type="button"
                className={`flex items-center gap-2 ${
                  isLoading ? `cursor-not-allowed` : "cursor-pointer"
                }`}
                onClick={HandleInvite}
                disabled={isLoading}
              >
                <FaUserPlus />
                Invite friends
              </button>
            </li>
            <li>
              <Link
                href="/about"
                className="flex items-center gap-2 cursor-pointer"
              >
                <BsExclamationCircleFill />
                About
              </Link>
            </li>
            <li className="flex items-center gap-2 cursor-pointer">
              <Link href="" className="flex items-center gap-2 cursor-pointer">
                <FaStar />
                Rate us
              </Link>
            </li>
          </ul>
        </footer>
      </div>
    </section>
  );
};

export default Section;
