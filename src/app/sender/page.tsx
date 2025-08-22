"use client";
import React, { useState } from "react";
import QRCode from "react-qr-code";
import { TbQrcodeOff } from "react-icons/tb";
import BackBtn from "@/components/BackBtn/BackBtn";
import { io } from "socket.io-client";
import { useConnection } from "@/context/ConnectionContext";

const page = () => {
  const { isConnected, setIsConnected } = useConnection();
  const [isQRCode, setIsQRCode] = useState(true);
  const [roomId, setRoomId] = useState<string>();

  // Create a socket connection
  const socket = io("http://localhost:3001");

  // Initial connection status
  socket.on("initial-connection", (data) => {
    console.log("Connection status:", data.isConnected);
    setIsConnected(data.isConnected);
  });

  // Generation of manual code
  const GenerateId = () => {
    let id =
      Math.trunc(Math.random() * 999) +
      "-" +
      Math.trunc(Math.random() * 999) +
      "-" +
      Math.trunc(Math.random() * 999);

    return id;
  };

  // Handling room creation
  const handleCreateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newRoomId: string = GenerateId();
    setRoomId(newRoomId);
    socket.emit("sender-join", { uid: newRoomId });
  };

  return (
    <div className="h-full">
      <BackBtn />
      {isQRCode && (
        <div className=" p-4">
          <div className="flex items-center justify-center text-center h-2 w-2">
            <QRCode
              value="couldnt connect"
              height={200}
              width={200}
              className="h-2"
            />
          </div>
          <hr className="my-6" />
          <span>
            <h1 className="text-2xl font-bold">Connect Page</h1>
            <p className="text-lg mb-6">
              connect to another device by scanning the QR code or entering the
              code manually.
            </p>
          </span>
        </div>
      )}

      {/* manual connect */}
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-semibold mb-2">Manual Connect</h2>
        <p className="text-lg mb-4">
          Click the button below to generate a unique room ID for manual
          connection.
        </p>

        <button
          onClick={handleCreateRoom}
          className="border-2 p-2 rounded-2xl cursor-pointer bg1-color hover:bg-[#00ca79] hover:text-white active:text-amber-300 active:bg-[#00ca7985] transition-colors duration-300"
        >
          Generate code
        </button>
        <h3>{roomId !== null ? roomId : ""}</h3>
      </div>

      {!isQRCode && (
        <div>
          <div className="flex items-center justify-center mt-6">
            <TbQrcodeOff className="text-[18rem]" />
          </div>
          <p>
            Unable to generate the QR code to connect due to the following
            issues. Please fix it and try again later.
          </p>
        </div>
      )}
    </div>
  );
};

export default page;
