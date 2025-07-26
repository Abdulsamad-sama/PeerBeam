"use client";
import React from "react";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";

const Connect = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Connect to Device</h1>
      <p>Scan the QR code below to connect to your device:</p>
      <div className="flex justify-center mt-4">
        <QRCode value="#" size={128} />
      </div>
      <button
        type="button"
        className="mt-4"
        onClick={() => {
          const socket = io("http://localhost:3001");
          socket.on("connect", () => {
            console.log("Connected to backend server");
          });
        }}
      >
        connect to andriod device
      </button>
    </div>
  );
};

export default Connect;
