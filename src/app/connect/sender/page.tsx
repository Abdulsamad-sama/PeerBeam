"use client";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { TbQrcodeOff } from "react-icons/tb";
import BackBtn from "@/components/BackBtn/BackBtn";
import { useConnection } from "@/context/ConnectionContext";
import { useRouter } from "next/navigation";

const Page = () => {
  // Destructure the managed state, socket, and the new creation function
  const { isConnected, setIsConnected, socket, roomId, createSenderRoom } =
    useConnection();
  const [isQRCode, setIsQRCode] = useState(true);
  const router = useRouter();

  // Socket Listeners: Handles the 'init' event when a receiver joins the room
  useEffect(() => {
    if (!socket) {
      return;
    }

    // Handler for when a receiver successfully joins the room
    const handleInit = () => {
      console.log(`Receiver connected to room ${roomId}.`);
      setIsConnected(true);
      // Navigating away from the connection page once a receiver joins
      router.push("/");
    };

    // Attach listener to the managed socket
    socket.on("init", handleInit);

    // Cleanup: ONLY remove the listeners
    return () => {
      socket.off("init", handleInit);
    };
  }, [socket, router, roomId, setIsConnected]);

  // Handling manual room creation
  const handleCreateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("UI Clicked");
    e.preventDefault();
    setIsQRCode(true);

    // Use the centralized function from the context
    createSenderRoom();
  };

  const currentRoomId = roomId;

  return (
    <div className="relative flex flex-col text-center h-full p-4 pt-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
      <BackBtn />
      <h1 className="text-3xl text-center font-bold mt-4">
        Connect to Receiver
      </h1>

      {/* QR Code section */}
      {isQRCode ? (
        <div className="p-3 flex flex-col items-center">
          <div
            className={`p-4 rounded-lg shadow-xl inline-block transition-transform duration-500 `}
          >
            <div className="flex items-center justify-center">
              {currentRoomId ? (
                <QRCode value={currentRoomId} className=" h-36 w-36" />
              ) : (
                <TbQrcodeOff className="text-[10rem] text-gray-400" />
              )}
            </div>
          </div>
          <hr className="my-6 w-1/2 border-gray-300 dark:border-gray-700" />
          <span>
            <p className="text-lg text-center">
              Connect to another device by scanning the QR code or entering the
              code manually.
            </p>
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <TbQrcodeOff className="text-9xl text-gray-500 dark:text-gray-400" />
          <p className="text-lg mb-4">
            QR code connection is currently unavailable.
          </p>
        </div>
      )}

      {/* manual connect */}
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-semibold mb-4">Manual Connect</h2>

        <button
          onClick={handleCreateRoom}
          disabled={!socket} // Disable if the managed socket isn't ready
          className={`border-2 p-3 rounded-full font-semibold transition-all duration-300 shadow-md ${
            !socket
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {socket ? "Generate Room Code" : "Connecting..."}
        </button>

        <div className="mt-6 flex flex-col items-center gap-2">
          <b className="text-3xl font-mono text-blue-500 dark:text-blue-400">
            {currentRoomId ? currentRoomId : "- - -"}
          </b>
          {currentRoomId && (
            <button
              onClick={() => {
                if (currentRoomId) navigator.clipboard.writeText(currentRoomId);
              }}
              className="text-sm px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              Copy Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
