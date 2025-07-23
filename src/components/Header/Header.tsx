"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      {/* DESKTOP VIEW */}
      <header className="  w-full h-[60px] flex bg-gray-800  text-white text-lg p-4 justify-between items-center">
        <div
          className="inline-flex sm:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <IoClose /> : <FaBars />}
        </div>
        <h1 className="text-3xl font-bold">My-Ecosystem</h1>

        <nav className="hidden sm:block">
          <ul className="flex items-center space-x-4">
            <li>
              <Link href="/">History</Link>
            </li>
            <li>
              <Link href="/ecosystem">Ecosystem</Link>
            </li>
            <li className="prim-color text-lg">
              <Link href="/connect">Connect</Link>
            </li>
          </ul>
        </nav>
        {/* MOBILE VIEW */}

        <nav className="sm:hidden flex bg-gray-800 text-white p-4">
          <ul className="flex flex-col space-y-2">
            <li className="text-lg">
              <Link href="/connect">Connect</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
