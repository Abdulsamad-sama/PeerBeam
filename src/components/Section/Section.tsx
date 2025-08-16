"use";
import React from "react";
import Link from "next/link";
import Connected from "@/components/connected/connected";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import { useAvatar } from "@/context/AvatarContext";
import { FaStar, FaUserCog, FaUserPlus } from "react-icons/fa";
import { BsExclamationCircleFill } from "react-icons/bs";

const Section = () => {
  const { avatar } = useAvatar();
  return (
    <section className="relative hidden sm:flex flex-col justify-between h-full w-60 p-2 overflow-hidden  text-lg border-r border-gray-200 dark:border-gray-700">
      <main className="flex flex-col gap-4">
        {/* username/ information */}
        <header className="flex flex-col justify-center items-center border-b-2 border-gray-500 dark:border-gray-700 pb-2">
          <div className="flex justify-center gap-2">
            <UserAvatar />
            <h1>Username</h1>
          </div>
          <Connected />
        </header>

        {/* files */}
        <div className="hidden">
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/videos">Videos</Link>
            </li>
            <li>
              <Link href="/pictures">Pictures</Link>
            </li>
            <li>
              <Link href="/documents">Document</Link>
            </li>
            <li>
              <Link href="/audio">Audio</Link>
            </li>
          </ul>
        </div>

        {/* connect */}
        <div className="mt-4">
          <Link
            href="/connect"
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded"
          >
            Connects
          </Link>
        </div>
      </main>

      {/* Other information */}
      <footer className="">
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
            <Link href="" className="flex items-center gap-2 cursor-pointer">
              <FaUserPlus />
              Invite friends
            </Link>
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
    </section>
  );
};

export default Section;
