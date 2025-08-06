"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaBars, FaCaretDown, FaCaretUp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { ToAndroid, ToPc, ToiOS } from "../connectOptions/connectOptions";
import Connected from "@/components/connected/connected";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  return (
    // Desktop view sets automatiacally
    <header className="  w-full h-[60px] flex bg-gray-800  text-white text-lg p-4 justify-around items-center">
      <div
        className="inline-flex sm:hidden"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        {isMenuOpen ? <IoClose /> : <FaBars />}
      </div>
      <h1 className="text-3xl font-bold">My-Ecosystem</h1>

      <nav className="flex items-center justify-between">
        {/* shows when in desktop mode */}
        {/* to be added to mobile menu side-bar   */}
        <ul className=" hidden sm:flex items-center space-x-4">
          <li>
            <Link href="/">History</Link>
          </li>
          <li>
            <Link href="/ecosystem">Ecosystem</Link>
          </li>
        </ul>
        {/* stays constant both in mobile and desktop view */}
        <button
          type="button"
          className="prim-color text-lg hover:underline underline-offset-4 flex items-center gap-2"
          onClick={() => setIsConnectOpen((prev) => !prev)}
        >
          Connect
          {isConnectOpen ? <FaCaretUp /> : <FaCaretDown />}
        </button>
      </nav>

      {/* hidden menu information */}
      {/* hidden connect menu*/}
      <div
        className={`absolute top-[65px] ${
          isConnectOpen ? "flex" : "hidden"
        } bg0-color items-center gap-2`}
      >
        <ol className="mt-4 space-y-2 ">
          <li className="border-b-2 border-b-gray-200">
            <ToAndroid />
          </li>
          <li className="border-b-2 border-b-gray-200">
            <ToiOS />
          </li>
          <li className="border-b-2 border-b-gray-200 ">
            <ToPc />
          </li>
        </ol>
      </div>

      {/* hidden side menu */}
      <section
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } flex-col justify-between relative  border-r border-gray-200 dark:border-gray-700 w-1/5 p-4 pr-7 text-lg`}
      >
        <main className="flex flex-col gap-4">
          {/* username/ information */}
          <header className="flex flex-col justify-center items-center border-b-2 border-gray-500 dark:border-gray-700 pb-2">
            <div className="flex justify-around">
              <Image
                src="/vercel.svg"
                alt="U"
                height={20}
                width={20}
                className=" bg-black m-1"
              />
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
          <div>
            <ul className="mt-4 space-y-2 ">
              <li className="border-b-2 border-b-gray-200">
                <ToAndroid />
              </li>
              <li className="border-b-2 border-b-gray-200">
                <ToiOS />
              </li>
              <li className="border-b-2 border-b-gray-200 ">
                <ToPc />
              </li>
            </ul>
          </div>
        </main>

        {/* Other information */}
        <footer className="">
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/settings">Settings</Link>
            </li>
            <li>
              <Link href="">Invite friends</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="">Rate us</Link>
            </li>
          </ul>
        </footer>
      </section>
    </header>
  );
};

export default Header;
