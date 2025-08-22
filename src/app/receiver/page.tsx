"use client";
import React, { useState } from "react";
import { useConnection } from "@/context/ConnectionContext";
import BackBtn from "@/components/BackBtn/BackBtn";
import { io } from "socket.io-client";

const Page = () => {
  // Separate input state from received sender ID
  const [inputSenderId, setInputSenderId] = useState("");
  const [receivedSenderId, setReceivedSenderId] = useState("");
  const { setIsConnected } = useConnection();
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  React.useEffect(() => {
    const newSocket = io("http://localhost:3001");

    newSocket.on("initial-connection", (data) => {
      console.log("Connection status:", data.isConnected);
      setIsConnected(data.isConnected);
    });

    newSocket.on("sender-join", (data) => {
      console.log("Sender ID:", data.uid);
      setReceivedSenderId(data.uid); // Don't overwrite input field
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [setIsConnected]);

  // Function to handle connection
  const handleConnect = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputSenderId && socket) {
      socket.emit("receiver-join", { uid: inputSenderId });
    } else {
      alert("Please enter a valid sender ID.");
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <BackBtn />

      <form onSubmit={handleConnect} className="">
        <input
          type="text"
          placeholder="Input sender id"
          aria-label="sender ID"
          value={inputSenderId}
          onChange={(e) => setInputSenderId(e.target.value)}
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
        <p>Input sender-id to connect</p>
        {receivedSenderId && (
          <p className="text-xs text-gray-500 mt-2">
            Connected to sender: {receivedSenderId}
          </p>
        )}
      </span>
    </div>
  );
};

export default Page;
