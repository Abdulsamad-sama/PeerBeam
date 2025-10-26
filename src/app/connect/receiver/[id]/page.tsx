"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useConnection } from "@/context/ConnectionContext";

type FileTransfer = {
  name: string;
  size: number;
  receivedBuffer: ArrayBuffer[];
  isComplete: boolean;
};

const ReceivingFilesPage = () => {
  const { roomId } = useConnection(); // Get the roomId from the context
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [files, setFiles] = useState<FileTransfer[]>([]);
  const [progress, setProgress] = useState<any>([]);

  useEffect(() => {
    const base_url = process.env.PUBLIC_SOCKET_URL || "http://localhost:3001";
    const newSocket = io(base_url);
    setSocket(newSocket);

    // Join the room to start receiving files
    newSocket.emit("receiver-join", { uid: roomId });
    newSocket.on("file-progress", (progressData) => {
      setProgress((prevFiles: any) => [
        ...prevFiles,
        {
          name: progressData.name,
          progress: progressData.progress,
        },
      ]);
    });

    // Listen for file metadata
    newSocket.on("file-meta", (metadata) => {
      console.log("File metadata received:", metadata);
      setFiles((prevFiles) => [
        ...prevFiles,
        {
          name: metadata.name,
          size: metadata.size,
          receivedBuffer: [],
          progress: 0,
          isComplete: false,
        },
      ]);
    });

    // Listen for file chunks
    newSocket.on("file-raw", ({ name, chunk }) => {
      console.log("File chunk received:", name);
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.name === name
            ? {
                ...file,
                // Store ArrayBuffer instances to satisfy BlobPart typing
                receivedBuffer: [
                  ...file.receivedBuffer,
                  new Uint8Array(chunk).buffer as ArrayBuffer,
                ],
                progress: Math.min(
                  ((file.receivedBuffer.reduce(
                    (acc, buffer) => acc + buffer.byteLength,
                    0
                  ) +
                    new Uint8Array(chunk).byteLength) /
                    file.size) *
                    100,
                  100
                ), // Calculate progress as a percentage
              }
            : file
        )
      );
    });

    // Listen for transfer completion
    newSocket.on("file-complete", (name) => {
      console.log(`File transfer complete: ${name}`);
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.name === name ? { ...file, isComplete: true } : file
        )
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  // Handle file download
  const handleDownload = (file: FileTransfer) => {
    const blob = new Blob(file.receivedBuffer, {
      type: "application/octet-stream",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="relative flex flex-col p-10 h-full dark:bg-gray-900">
      <h1 className="text-2xl md:text-3xl font-extrabold">Receiving Files</h1>

      <ul className="mt-4">
        {files.map((file, index) => (
          <li key={index} className="mb-4 p-4 border rounded-lg">
            <p className="text-lg">File: {file.name}</p>
            <p className="text-sm">
              Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <p className="text-sm">
              Progress:{" "}
              {progress.map((pg: any) => {
                if (pg.name === file.name) return pg.progress;
              })}
              %
            </p>
            {/* {file.isComplete && ( */}
            <button
              onClick={() => handleDownload(file)}
              disabled={progress !== 100.0 ? true : false}
              className="mt-2 p-2 bg-green-500 text-white rounded-lg"
            >
              Download
            </button>
            {/* )} */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceivingFilesPage;
