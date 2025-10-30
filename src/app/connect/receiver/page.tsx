"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackBtn from "@/components/BackBtn/BackBtn";
import { useConnection } from "@/context/ConnectionContext";

const Page = () => {
  const [senderId, setSenderId] = useState("");
  const { isConnected, roomId, joinSenderRoom, leaveRoom } = useConnection();
  const router = useRouter();

  // navigate to the receiver transfer page when context confirms we're joined
  useEffect(() => {
    if (isConnected && roomId) {
      router.push(`/connect/receiver/${roomId}`);
    }
  }, [isConnected, roomId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderId.trim()) return;
    try {
      await joinSenderRoom(senderId.trim());
      // joinSenderRoom sets isConnected/roomId in context on success
    } catch (err: any) {
      console.error("Failed to join:", err);
      alert(err?.message || "Failed to join sender room");
    }
  };

  return (
    <div className="relative h-full flex flex-col items-center justify-center p-4">
      <BackBtn />

      <form onSubmit={handleSubmit} className="flex flex-col items-center">
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
          className="rounded-2xl p-2 mb-4 bg1-color hover:bg-[#00ca79] hover:text-white transition-colors duration-300"
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
        <p className="text-xs text-gray-500 mt-2">
          Context connected: {isConnected ? "yes" : "no"}
        </p>
        {/* {isConnected && (
          <button
            onClick={() => {
              leaveRoom();
              setSenderId("");
            }}
            className="mt-2 text-sm text-red-500"
          >
            Leave
          </button>
        )} */}
      </span>
    </div>
  );
};

export default Page;
