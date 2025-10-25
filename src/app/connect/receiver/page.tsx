"use client";
import React, { useState, useEffect } from "react";
import { useConnection } from "@/context/ConnectionContext";
import BackBtn from "@/components/BackBtn/BackBtn";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

const Page = () => {
  const [senderId, setSenderId] = useState("");
  const { isConnected, setIsConnected, setRoomId, roomId } = useConnection();
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const router = useRouter();

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("me", (data) => {
      console.log("serverid:", data.uid);
    });

    return () => {
      newSocket.off("connection-status");
      newSocket.disconnect();
    };

    // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (isConnected) {
      router.push("/transferringFiles"); // Navigate after the component renders
    }
  }, [isConnected, router]);

  const generateId = () => {
    return (
      Math.trunc(Math.random() * 999) +
      "-" +
      Math.trunc(Math.random() * 999) +
      "-" +
      Math.trunc(Math.random() * 999)
    );
  };

  // Function to handle connection
  const handleConnect = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!socket) {
      alert("Socket connection not established. Please try again.");
      return;
    }

    if (!senderId) {
      alert("Please enter a valid sender ID.");
      return;
    }

    const receiver_Id = generateId();

    // Emit the receiver-join event with the generated ID and input sender ID
    socket.emit("receiver-join", {
      uid: receiver_Id,
      sender_uid: senderId,
    });

    if (senderId.trim() !== "") {
      setIsConnected(true); // Set connection state to true
    }
  };

  return (
    <div className=" relative h-full flex flex-col items-center justify-center p-4">
      <BackBtn />

      <form onSubmit={handleConnect} className=" flex flex-col items-center">
        <input
          type="text"
          placeholder="Input sender id"
          aria-label="sender ID"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
          className="border-2 rounded-2xl p-2 mb-4"
        />
        <button
          type="submit"
          aria-label="Connect to sender"
          className="rounded-2xl p-2 mb-4 bg1-color hover:bg-[#00ca79] hover:text-white active:text-amber-300 active:bg-[#00ca7985] transition-colors duration-300"
        >
          Connect
        </button>
      </form>
      <hr className="my-6" />
      <span>
        <p>Input sender's ID to connect</p>
        {senderId && (
          <p className="text-xs text-gray-500 mt-2">
            Connect to sender: {senderId}
          </p>
        )}
      </span>
    </div>
  );
};

export default Page;
