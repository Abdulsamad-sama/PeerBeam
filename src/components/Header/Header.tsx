"use client";
import React from "react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaCaretDown,
  FaCaretUp,
  FaRegUserCircle,
  FaStar,
  FaUserCog,
  FaUserPlus,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { ToAndroid, ToPc, ToiOS } from "../connectOptions/connectOptions";
import Connected from "@/components/connected/connected";
import { BsExclamationCircleFill } from "react-icons/bs";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (
        menuRef.current &&
        event.target &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // Desktop view sets automatiacally
    <header className=" w-full h-[60px] flex bg-gray-800  text-white text-lg p-4 justify-around items-center">
      <div
        className="inline-flex sm:hidden mr-2 cursor-pointer"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        {isMenuOpen ? <IoClose /> : <FaBars />}
      </div>
      <h1 className="text-3xl font-bold">My-Ecosystem</h1>

      <nav className="flex items-right text-right justify-between gap-x-4">
        {/* shows when in desktop mode */}
        <ul className=" hidden sm:flex items-center space-x-4">
          <li>
            <Link href="/">History</Link>
          </li>
          <li>
            <Link href="/ecosystem">Ecosystem</Link>
          </li>
        </ul>
        {/* stays constant both in mobile and desktop view */}
        {/* button to show connect options */}
        <div className="relative cursor-pointer">
          <button
            type="button"
            className="prim-color text-lg hover:underline underline-offset-4 flex items-center gap-2"
            onClick={() => setIsConnectOpen((prev) => !prev)}
          >
            Connect
            {isConnectOpen ? <FaCaretUp /> : <FaCaretDown />}
          </button>

          {/* hidden connect menu*/}
          <div
            ref={menuRef}
            className={`${
              isConnectOpen ? "flex" : "hidden"
            } absolute top-[46px] -right-2 text-black  items-center gap-2 w-48 p-4 rounded-lg shadow-lg flex-col`}
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
        </div>
      </nav>

      {/* hidden menu information */}

      {/* hidden section menu for mobile view */}
      <section
        ref={menuRef}
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } absolute left-0 top-[60px] w-50 h-[91.8%] p-2 text-lg flex-col justify-between text-black border-r border-gray-200 dark:border-gray-700 shadow-2xl`}
      >
        <main className="flex flex-col gap-4">
          {/* username/ information */}
          <header className="flex flex-col justify-center items-center border-b-2 border-gray-500 dark:border-gray-700 pb-2">
            <div className="flex justify-around">
              <FaRegUserCircle className="text-3xl" />
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

          {/* added feature from header fo mobile */}
          <section>
            <ul className="mt-4 space-y-4">
              <li className="border-b-2 border-b-gray-200">
                <Link href="/">History</Link>
              </li>
              <li className="border-b-2 border-b-gray-200">
                <Link href="/ecosystem">Ecosystem</Link>
              </li>
            </ul>
          </section>
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
    </header>
  );
};

export default Header;
