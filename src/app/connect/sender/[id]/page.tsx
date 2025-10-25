"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useConnection } from "@/context/ConnectionContext";

const ReceivingFilesPage = ({ params }: { params: any }) => {
  const { roomId } = useConnection(); // Get the roomId from the context
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [receivedBuffer, setReceivedBuffer] = useState<Uint8Array[]>([]);
  const [receivedProgress, setReceivedProgress] = useState(0);
  const [isTransferComplete, setIsTransferComplete] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    // Join the room to start receiving files
    newSocket.emit("receiver-join", { uid: roomId });

    // Listen for file metadata
    newSocket.on("file-meta", (metadata) => {
      console.log("File metadata received:", metadata);
      setFileName(metadata.name);
      setFileSize(metadata.size);
      setReceivedBuffer([]);
      setReceivedProgress(0);
      setIsTransferComplete(false);
    });

    // Listen for file chunks
    newSocket.on("file-raw", (data) => {
      console.log("File chunk received:", data);
      setReceivedBuffer((prevBuffer) => [...prevBuffer, new Uint8Array(data)]);
      setReceivedProgress((prev) => prev + data.byteLength);
    });

    // Listen for transfer completion
    newSocket.on("file-complete", () => {
      console.log("File transfer complete");
      setIsTransferComplete(true);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  // Handle file download
  const handleDownload = () => {
    const blob = new Blob(receivedBuffer, { type: "application/octet-stream" });
    const downloadUrl = URL.createObjectURL(blob);

    // Trigger file download
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="relative flex flex-col p-10 h-full dark:bg-gray-900">
      <h1 className="text-2xl md:text-3xl font-extrabold">Receiving Files</h1>

      {fileName && (
        <div className="mt-4">
          <p className="text-lg">Receiving: {fileName}</p>
          <p className="text-sm">
            Size: {(fileSize / (1024 * 1024)).toFixed(2)} MB
          </p>
          <p className="text-sm">
            Progress: {((receivedProgress / fileSize) * 100).toFixed(2)}%
          </p>
        </div>
      )}

      {isTransferComplete && (
        <button
          onClick={handleDownload}
          className="mt-4 p-2 bg-green-500 text-white rounded-lg"
        >
          Download File
        </button>
      )}
    </div>
  );
};

export default ReceivingFilesPage;
