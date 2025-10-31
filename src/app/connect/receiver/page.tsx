"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackBtn from "@/components/BackBtn/BackBtn";
import { useConnection } from "@/context/ConnectionContext";

const Page = () => {
  const [senderId, setSenderId] = useState("");
  const { isConnected, roomId, joinSenderRoom, isLoading, leaveRoom } =
    useConnection();
  const router = useRouter();

  // navigate to the receiver transfer page when context confirms we're joined
  useEffect(() => {
    if (isConnected && roomId) {
      router.replace(`/connect/receiver/${roomId}`);
    }
  }, [isConnected, roomId, router, isLoading]);

  const [showLoadingAlert, setShowLoadingAlert] = useState(false);
  useEffect(() => {
    setShowLoadingAlert(isLoading);
  }, [isLoading]);

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
      {/* transient alert shown while context reports loading */}
      {showLoadingAlert && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-100 text-yellow-900 border border-yellow-300 px-4 py-2 rounded-lg shadow"
        >
          <span className="font-medium">Connecting to sender...</span>
        </div>
      )}

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
