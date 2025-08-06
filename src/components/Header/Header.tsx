"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaCaretDown, FaCaretUp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { ToAndroid, ToPc, ToiOS } from "../connectOptions/connectOptions";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  return (
    <div>
      {/* DESKTOP VIEW */}
      <header className="  w-full h-[60px] flex bg-gray-800  text-white text-lg p-4 justify-around items-center">
        <div
          className="inline-flex sm:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <IoClose /> : <FaBars />}
        </div>
        <h1 className="text-3xl font-bold">My-Ecosystem</h1>

        <nav className="flex items-center justify-between">
          <ul className=" hidden sm:flex items-center space-x-4">
            <li>
              <Link href="/">History</Link>
            </li>
            <li>
              <Link href="/ecosystem">Ecosystem</Link>
            </li>
          </ul>
          <button
            type="button"
            className="prim-color text-lg hover:underline underline-offset-4 flex items-center gap-2"
            onClick={() => setIsConnectOpen((prev) => !prev)}
          >
            Connect
            {isConnectOpen ? <FaCaretUp /> : <FaCaretDown />}
          </button>
        </nav>
      </header>
    </div>
  );
};

export default Header;
