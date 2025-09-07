"use client";
import React, { useState, useEffect } from "react";
import { useConnection } from "@/context/ConnectionContext";
import BackBtn from "@/components/BackBtn/BackBtn";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

const Page = () => {
  // Separate input state from received sender ID
  const [inputSenderId, setInputSenderId] = useState("");
  const { isConnected, setIsConnected, setRoomId, roomId } = useConnection();
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const router = useRouter();

  console.log(isConnected);
  useEffect(() => {
    const newSocket = io("http://localhost:3001");

    newSocket.on("connection-status", (data) => {
      setIsConnected(data.isConnected);
      console.log("connection status:", data.isConnected);
      console.log("isconnection status:", isConnected);
    });

    // newSocket.on("receiver-join", (data) => {
    //   console.log("Sender ID:", data.uid);
    //   setReceivedSenderId(data.uid); // Don't overwrite input field
    // });

    // Connection established, navigate to /page/[id]
    // newSocket.on("init", (sender_uid) => {
    //   router.push(`/page/${sender_uid}`);
    // });

    setSocket(newSocket);

    return () => {
      newSocket.off("connection-status");
      newSocket.disconnect();
    };

    // Cleanup on unmount
  }, []);

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

    if (!inputSenderId) {
      alert("Please enter a valid sender ID.");
      return;
    }

    const receiver_Id = generateId();

    // Emit the receiver-join event with the generated ID and input sender ID
    socket.emit("receiver-join", {
      uid: receiver_Id,
      sender_uid: inputSenderId,
    });
    console.log("isConnected:", isConnected);
    console.log(
      `Receiver joined with ID: ${receiver_Id}, connecting to sender: ${inputSenderId}`
    );

    //set roomId to inputSenderId
    if (isConnected == true) {
      setRoomId(inputSenderId);
    }
    console.log(roomId);

    // Navigate to the new page with the sender ID
  };

  return (
    <div className=" relative h-full flex flex-col items-center justify-center p-4">
      <BackBtn />

      <form onSubmit={handleConnect} className=" flex flex-col items-center">
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
        <p>Input sender's ID to connect</p>
        {inputSenderId && (
          <p className="text-xs text-gray-500 mt-2">
            Connected to sender: {inputSenderId}
          </p>
        )}
      </span>
    </div>
  );
};

export default Page;
