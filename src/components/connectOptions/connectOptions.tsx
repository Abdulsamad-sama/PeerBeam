"use client";
import React, { useState } from "react";
import { BsLaptop } from "react-icons/bs";
import { MdPhoneAndroid, MdPhoneIphone } from "react-icons/md";
import { io } from "socket.io-client";

const socket = io();

function useConnectOptions() {
  const [roomId, setRoomId] = useState("");
  const [connected, setConnected] = useState(false);

  const handleConnect = (deviceType: string) => {
    const newRoomId = `${deviceType}-${Math.random()
      .toString(36)
      .substring(2, 8)}`;
    setRoomId(newRoomId);
    socket.emit("join-room", newRoomId);
    setConnected(true);
  };

  return { roomId, connected, handleConnect };
}

const handleConect = () => {
  return;
};

export function ToAndroid() {
  const { roomId, connected, handleConnect } = useConnectOptions();
  return (
    <>
      <button
        onClick={() => handleConnect("android")}
        className="flex items-center gap-1 cursor-pointer"
      >
        <MdPhoneAndroid />
        Connect to Android
      </button>
      {connected && (
        <p className="text-green-500">Connected to room: {roomId}</p>
      )}
    </>
  );
}

export function ToiOS() {
  const { roomId, connected, handleConnect } = useConnectOptions();
  return (
    <>
      <button
        onClick={() => handleConnect("iOS")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <MdPhoneIphone />
        Connect to iOS
      </button>
      {connected && (
        <p className="text-green-500">Connected to room: {roomId}</p>
      )}
    </>
  );
}

export function ToPc() {
  const { roomId, connected, handleConnect } = useConnectOptions();
  return (
    <>
      <button
        onClick={() => handleConnect("PC")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <BsLaptop />
        Connect to PC
      </button>
      {connected && (
        <p className="text-green-500">Connected to room: {roomId}</p>
      )}
    </>
  );
}
