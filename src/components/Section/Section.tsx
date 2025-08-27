"use clent";
import React from "react";
import Link from "next/link";
import Connected from "@/components/connected/connected";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import UserName from "@/components/UserName/UserName";
import { FaStar, FaUserCog, FaUserPlus } from "react-icons/fa";
import { BsExclamationCircleFill } from "react-icons/bs";

const Section = () => {
  return (
    <section className="relative hidden sm:flex flex-col justify-between h-full w-60 p-2 overflow-hidden  text-lg border-r border-gray-200 dark:border-gray-600 dark:bg-gray-900">
      <main className="flex flex-col gap-4">
        {/* username/ information */}
        <header className="flex flex-col justify-center items-center border-b-2 border-gray-500 dark:border-gray-700 pb-2">
          <div className="flex justify-center gap-2">
            <UserAvatar />
            <UserName />
          </div>
          <Connected />
        </header>

        {/* connect */}
        <div className="mt-4">
          <nav>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link
                  href="/connect"
                  className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                >
                  Connect
                </Link>
              </li>
            </ul>
          </nav>
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
