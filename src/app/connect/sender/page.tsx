"use client";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { TbQrcodeOff } from "react-icons/tb";
import BackBtn from "@/components/BackBtn/BackBtn";
import { io, Socket } from "socket.io-client";
import { useConnection } from "@/context/ConnectionContext";
import { useRouter } from "next/navigation";

const Page = () => {
  const { isConnected, setIsConnected } = useConnection();
  const [isQRCode, setIsQRCode] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  // Create a socket connection only once
  useEffect(() => {
    let receiver_Id;
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    // goto home page immediately after connection
    newSocket.on("init", (uid) => {
      receiver_Id = uid;
      setIsConnected(true);
      router.push(`/`);
    });

    // Cleanup on unmount
    return () => {
      newSocket.off("connection-status");
      newSocket.disconnect();
    };
  }, []);

  // Generation of manual code
  const GenerateId = () => {
    return (
      Math.trunc(Math.random() * 999) +
      "-" +
      Math.trunc(Math.random() * 999) +
      "-" +
      Math.trunc(Math.random() * 999)
    );
  };

  // Handling manual room creation
  const handleCreateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsQRCode(true);
    const newRoomId: string = GenerateId();
    setRoomId(newRoomId);

    if (socket) {
      socket.emit("sender-join", { uid: newRoomId });
    }
  };

  return (
    <div className="relative flex flex-col text-center h-full p-4 pt-8">
      <BackBtn />
      <h1 className="text-3xl text-center font-bold mt-4">
        Connect to Receiver
      </h1>

      {/* QR Code section */}
      {isQRCode ? (
        <div className="p-4">
          <div className="flex items-center justify-center">
            <QRCode
              value={roomId ? roomId : "couldnt connect"}
              className=" h-36 w-36"
            />
          </div>
          <hr className="my-4" />
          <span>
            <p className="text-lg text-center md:mb-4">
              Connect to another device by scanning the QR code or entering the
              code manually.
            </p>
          </span>
        </div>
      ) : (
        <div className="">
          <div className="flex items-center justify-center">
            <TbQrcodeOff className="text-9xl" />
          </div>
          <p className="text-lg mb-4">
            Unable to generate the QR code to connect due to the following
            issues. Please fix it and try again later.
          </p>
        </div>
      )}

      {/* manual connect */}
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-semibold mb-2">Manual Connect</h2>

        <p className="text-lg mb-2">
          Click the button below to generate a unique room ID for manual
          connection.
        </p>

        <button
          onClick={handleCreateRoom}
          disabled={false}
          className="border-2 p-2 rounded-2xl cursor-pointer bg1-color hover:bg-[#00ca79] hover:text-white active:text-amber-300 active:bg-[#00ca7985] transition-colors duration-300"
        >
          Generate code
        </button>
        <div className="mt-4 flex gap-2 item-center">
          <b>{roomId ? roomId : ""}</b>
          {roomId && (
            <button
              onClick={() => navigator.clipboard.writeText(roomId)}
              className=" text-blue-500 hover:underline"
            >
              Copy
            </button>
          )}
        </div>

        <p></p>
      </div>
    </div>
  );
};

export default Page;
