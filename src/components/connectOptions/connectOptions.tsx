"use client";
import React, { useState } from "react";
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

export function ToAndroid() {
  const { roomId, connected, handleConnect } = useConnectOptions();
  return (
    <>
      <button onClick={() => handleConnect("android")} className="">
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
      <button onClick={() => handleConnect("iOS")} className="">
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
      <button onClick={() => handleConnect("PC")} className=" transition">
        Connect to PC
      </button>
      {connected && (
        <p className="text-green-500">Connected to room: {roomId}</p>
      )}
    </>
  );
}
