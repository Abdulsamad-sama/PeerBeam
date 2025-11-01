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
import Connected from "@/components/connected/connected";
import { BsExclamationCircleFill } from "react-icons/bs";
import UserAvatar from "@/components/UserAvatar/UserAvatar";
import UserName from "@/components/UserName/UserName";

import { useConnection } from "@/context/ConnectionContext";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { isConnected, leaveRoom } = useConnection();

  useEffect(() => {
    function handleClickOutside(event: Event) {
      const target = event.target as Node;
      if (menuRef.current && target && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDisconnect = () => {
    console.log("Disconnected");
    leaveRoom();
  };

  return (
    // Desktop view sets automatiacally
    <header className=" w-full h-[60px] flex bg-gray-800  text-white text-lg p-4 justify-around items-center">
      <div
        className="inline-flex sm:hidden mr-2 cursor-pointer"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        {isMenuOpen ? <IoClose /> : <FaBars />}
      </div>
      <h1 className="text-xl md:text-3xl font-bold">PeerBeam</h1>

      <nav className="flex items-right justify-between gap-x-4">
        {/* shows when in desktop mode */}
        <ul className=" hidden sm:flex items-center space-x-4">
          <li>
            <Link href="/">History</Link>
          </li>
        </ul>

        {/* connect/ disconnect button */}
        <div>
          {!isConnected ? (
            // connetion button
            <Link
              href="/connect"
              className="cursor-pointer bg-gray-200 text-gray-800 p-1 hover:text-gray-200 hover:outline-gray-800 dark:hover:bg-gray-800 rounded"
            >
              Connect
            </Link>
          ) : (
            // Disconnect Button
            <button
              type="button"
              onClick={handleDisconnect}
              className="bg-red-400 rounded-xl p-1.5 hover:bg-red-500 text-white cursor-pointer"
            >
              Disconnect
            </button>
          )}
        </div>
      </nav>

      {/* hidden menu information */}

      {/* hidden section menu for mobile view */}
      <section
        ref={menuRef}
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } absolute sm:hidden left-0 top-[60px] w-50 h-[89%] p-2 text-lg flex-col justify-between text-black bg-gray-200 shadow-2xl z-50 opacity border-r border-gray-200 dark:border-gray-700`}
      >
        {/* username/ information */}
        <header className="flex justify-around items-center border-b-2 border-gray-500 dark:border-gray-700 pb-2">
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
          <footer className="absolute bottom-10 w-full px-2">
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
                <Link
                  href=""
                  className="flex items-center gap-2 cursor-pointer"
                >
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
                <Link
                  href=""
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FaStar />
                  Rate us
                </Link>
              </li>
            </ul>
          </footer>
        </div>
      </section>
    </header>
  );
};

export default Header;
