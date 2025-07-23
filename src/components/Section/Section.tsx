import React from "react";
import QRCode from "react-qr-code";
import Image from "next/image";
import Link from "next/link";
import Connected from "@/components/connected/connected";
const Section = () => {
  console.log(QRCode);
  return (
    <section className="hidden flex-col justify-between relative  border-r border-gray-200 dark:border-gray-700 w-1/5 p-4 pr-7 text-lg sm:flex">
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
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/connect">Connect to PC</Link>
            </li>
            <li>
              <Link href="/connect">Connect to Android</Link>
            </li>
            <li>
              <Link href="/connect">Connect to iOS</Link>
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
  );
};

export default Section;
