"use client";
import React, { useState, useEffect } from "react";
import { FaCaretRight, FaPlus } from "react-icons/fa6";
import { io, Socket } from "socket.io-client";
import { useConnection } from "@/context/ConnectionContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFileProgress } from "@/context/FileProgressContext";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  const { updateFileProgress } = useFileProgress();

  // Initialize socket connection
  useEffect(() => {
    const base_url = process.env.PUBLIC_SOCKET_URL || "http://localhost:3001";
    const newSocket = io(base_url);
    setSocket(newSocket);

    newSocket.on("init", (sender_uid) => {
      setRoomId(sender_uid);
      console.log(roomId);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleFileChange = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    // setFiles((prevFiles) => {
    //   // Filter out duplicates based on name and size
    //   const existing = new Map(prevFiles.map(file => [file.name + file.size, file]));
    //   newFiles.forEach(file => existing.set(file.name + file.size, file));
    //   return Array.from(existing.values());
    // });

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };
  // console.log("Files after update:", files);

  //Send file metadata and chunks
  const sendFile = () => {
    console.log("you clicked");
    if (!files || !socket || files.length === 0) return;

    const chunkSize = 1024 * 64; // 64KB
    let fileIndex = 0;
    let offset = 0;
    const reader = new FileReader();

    const sendNextFile = () => {
      if (fileIndex >= files.length) {
        console.log("All files sent");
        setFiles([]);
        return;
      }

      const file = files[fileIndex];
      offset = 0;

      const metadata = {
        name: file.name,
        size: file.size,
        type: file.type,
      };

      socket.emit("file-meta", { uid: roomId, metadata });

      socket.emit("file-start", { uid: roomId });

      const readNextChunk = () => {
        const slice = file.slice(offset, offset + chunkSize);
        reader.readAsArrayBuffer(slice);
      };

      console.log(readNextChunk);

      reader.onload = (event) => {
        if (event.target?.result && socket) {
          socket.emit("file-raw", {
            uid: roomId,
            buffer: event.target.result,
          });

          offset += chunkSize;
          const progress = Math.min((offset / file.size) * 100, 100);
          const progressData = {
            name: file.name,
            progress: progress,
          };
          socket.emit("file-progress", { uid: roomId, progressData });
          updateFileProgress(file.name, progress);

          if (offset < file.size) {
            readNextChunk();
          } else {
            // File finished, move to the next
            fileIndex++;
            sendNextFile();
          }
        }
      };

      // Start reading first chunk
      readNextChunk();
    };

    sendNextFile();
  };

  const handlefile = () => {
    router.push("//fileTranfering");
  };

  return (
    <div
      className="relative flex flex-col gap-8 items-center justify-center h-full dark:bg-gray-900"
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add("border-blue-500");
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-blue-500");
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-blue-500");
        handleFileChange(e.dataTransfer.files);
      }}
    >
      {/* Show how many file is selected*/}
      {files.length > 0 && (
        <div className="relative w-38 h-38 p-4 text-center">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-8 border-l-8 border-gray-400 rounded-tl-2xl"></div>

          <div className="absolute top-0 right-0 w-8 h-8 border-t-8 border-r-8 border-gray-400 rounded-tr-2xl"></div>

          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-8 border-l-8 border-gray-400 rounded-bl-2xl"></div>

          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-8 border-r-8 border-gray-400 rounded-br-2xl"></div>

          <p className="text-center mt-8 font-extrabold text-6xl text-gray-500">
            {files.length}
          </p>
        </div>
      )}

      <div className="hidden sm:flex items-center text-center text-2xl text-gray-400 border-dashed border-gray-500">
        <FaPlus className="mr-3" />
        <p className="font-bold cursor-default ">
          Drag and drop files here to send
        </p>
      </div>

      <div className=" relative overflow-hidden flex items-center gap-4 h-10 p-4 border border-gray-500 cursor-pointer">
        <input
          className="absolute opacity-0 inset-0 cursor-pointer"
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              handleFileChange(e.target.files);
              e.target.value = "";
            }
          }}
        />
        <div className=" flex items-center">
          <FaPlus className="mr-1" />
          <p className="cursor-pointer ">Choose from files</p>
        </div>
      </div>

      {files.length > 0 && (
        <button
          type="button"
          onClick={sendFile}
          className="absolute bottom-4 right-4 p-1 rounded-lg text-center bg-green-100 hover:bg-green-400 transition-colors"
        >
          Send
          <FaCaretRight className="ml-1 text-center inline-flex" />
        </button>
      )}

      <div
        draggable="true"
        className="rounded-full absolute right-2 h-6 w-6 bg-amber-300"
        // onDragEnd={"stop"}
        onClick={() => router.push("/transferringFiles")}
      >
        <Link href="/fileTranfering"></Link>
      </div>
    </div>
  );
}
