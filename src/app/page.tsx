"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaCaretRight, FaPlus } from "react-icons/fa6";
import { useConnection } from "@/context/ConnectionContext";
import { useRouter } from "next/navigation";
import { useFileProgress } from "@/context/FileProgressContext";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0); // Not actively used, kept for completeness

  // Use managed socket, connection status, and room ID from the context
  const { isConnected, socket, roomId } = useConnection();

  const router = useRouter();
  // 💡 UPDATED: Destructure activeTransfers and markFileComplete
  const { updateFileProgress, activeTransfers, markFileComplete } =
    useFileProgress();

  // --- Draggable Button State and Logic ---
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Initial position: 30px from left, 80px from bottom (view is bottom-left aligned)
  const [position, setPosition] = useState({ x: 30, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  // 💡 Check: Determine if any file is currently being transferred using the derived state
  const isAnyFileTransferring = activeTransfers.length > 0;

  useEffect(() => {
    // Initialize position relative to viewport bottom-left on component mount
    if (typeof window !== "undefined") {
      // Set initial Y position relative to the screen height
      setPosition((prev) => ({ ...prev, y: window.innerHeight - 80 }));
    }
  }, []);

  // --- Drag Handlers (Identical to previous, but included for context) ---

  const handleDragStart = (clientX: number, clientY: number) => {
    if (!buttonRef.current) return;
    setIsDragging(true);
    // Disable transition during drag for immediate movement
    buttonRef.current.style.transition = "none";

    const rect = buttonRef.current.getBoundingClientRect();
    offset.current = {
      // Calculate offset from click/touch point to the element's top-left corner
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    // Calculate new position based on cursor/touch position and initial offset
    const newX = clientX - offset.current.x;
    const newY = clientY - offset.current.y;

    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    if (!buttonRef.current) return;
    setIsDragging(false);
    // Re-enable transition for smooth movement when dragging stops
    buttonRef.current.style.transition = "transform 0.3s ease";
  };

  // Attach/Remove global event listeners for dragging
  useEffect(() => {
    const moveHandler = (e: MouseEvent | TouchEvent) => {
      // Determine client coordinates for both mouse and touch events
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      handleDragMove(clientX, clientY);
    };

    const upHandler = () => handleDragEnd();

    if (isDragging) {
      document.addEventListener("mousemove", moveHandler);
      document.addEventListener("mouseup", upHandler);
      document.addEventListener("touchmove", moveHandler);
      document.addEventListener("touchend", upHandler);
    } else {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", upHandler);
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("touchend", upHandler);
    }

    return () => {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", upHandler);
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("touchend", upHandler);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if it's a primary mouse button press (left click)
    if (e.button === 0) handleDragStart(e.clientX, e.clientY);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1)
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  // --- Standard Component Logic ---

  // Check connection status on mount and redirect if not ready
  useEffect(() => {
    if (!roomId) {
      router.replace("/connect/sender");
    }
  }, [roomId, router]);

  const handleFileChange = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  //Send file metadata and chunks
  const sendFile = () => {
    // 1. Pre-transfer checks using managed state
    if (files.length === 0) return;
    if (!socket || !roomId) {
      console.error(
        "Socket or Room ID not ready. Redirecting to connect page."
      );
      router.push("/connect/sender");
      return;
    }

    if (!isConnected) {
      console.error("Connection is not acknowledged (Receiver not joined).");
      return;
    }

    const chunkSize = 1024 * 64; // 64KB
    let fileIndex = 0;
    const reader = new FileReader();

    // Navigate immediately to the transfer page before sending begins
    router.push("/transferringFiles");

    const sendNextFile = () => {
      if (fileIndex >= files.length) {
        console.log("All files sent");
        // Clear the file list state in the sender UI
        setFiles([]);
        return;
      }

      const file = files[fileIndex];
      let offset = 0;

      // 1. Send File Metadata
      const metadata = {
        name: file.name,
        size: file.size,
        type: file.type,
      };

      // Emit metadata and file start to the room
      socket.emit("file-meta", { uid: roomId, metadata });
      socket.emit("file-start", { uid: roomId });

      const readNextChunk = () => {
        const slice = file.slice(offset, offset + chunkSize);
        reader.readAsArrayBuffer(slice);
      };

      reader.onload = (event) => {
        if (event.target?.result && socket) {
          // 2. Send chunk data
          socket.emit("file-raw", {
            uid: roomId,
            buffer: event.target.result,
          });

          offset += chunkSize;

          // 3. Update and emit progress
          const currentProgress = Math.min((offset / file.size) * 100, 100);
          const progressData = {
            name: file.name,
            progress: currentProgress,
          };

          socket.emit("file-progress", { uid: roomId, progressData });
          updateFileProgress(file.name, currentProgress); // Update local progress context

          if (offset < file.size) {
            readNextChunk();
          } else {
            // File finished, ensure 100% progress is emitted
            updateFileProgress(file.name, 100);
            // 💡 NEW: Mark file as complete in the context (removes it from activeTransfers)
            markFileComplete(file.name);

            // Move to the next file
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

  return (
    <div
      className="relative flex flex-col gap-8 items-center justify-center h-full dark:bg-gray-900 min-h-screen p-4"
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
      {/* Connection Status Indicator */}
      <p
        className={`absolute top-4 right-4 text-sm font-semibold p-1 rounded-full ${
          isConnected ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
      >
        {isConnected ? "Connected" : "Waiting for Receiver..."}
      </p>

      {/* Show how many file is selected*/}
      {files.length > 0 && (
        <div className="relative w-38 h-38 p-4 text-center border-4 border-gray-400 dark:border-gray-600 rounded-3xl shadow-xl">
          <p className="text-center mt-8 font-extrabold text-7xl text-gray-500 dark:text-gray-400">
            {files.length}
          </p>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
            Files Ready
          </p>
        </div>
      )}

      <div className="hidden sm:flex items-center text-center text-xl text-gray-400 dark:text-gray-500 border-dashed border-gray-500">
        <FaPlus className="mr-3" />
        <p className="font-bold cursor-default ">
          Drag and drop files here to send
        </p>
      </div>

      <div className=" relative overflow-hidden flex items-center gap-4 h-12 px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer">
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
        <div className=" flex items-center text-gray-800 dark:text-gray-100">
          <FaPlus className="mr-2" />
          <p className="cursor-pointer font-semibold">Choose from files</p>
        </div>
      </div>

      {files.length > 0 && (
        <button
          type="button"
          onClick={sendFile}
          // Disable button if not connected to prevent sending to thin air
          disabled={!isConnected}
          className={`absolute bottom-6 right-6 p-3 rounded-full text-center text-lg font-bold transition-all duration-300 shadow-lg ${
            isConnected
              ? "bg-green-500 hover:bg-green-600 text-white transform hover:scale-105"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
        >
          Send {files.length}
          <FaCaretRight className="ml-1 text-center inline-flex h-5 w-5" />
        </button>
      )}

      {/* 💡 Draggable "View Transfer Status" Button - Only visible if transfers are active */}
      {isAnyFileTransferring && (
        <button
          ref={buttonRef}
          type="button"
          className="fixed z-50 h-14 w-14 bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-2xl rounded-full transition-transform duration-300 active:cursor-grabbing"
          style={{
            left: 0,
            top: 0,
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={(e) => {
            // Prevent click event from firing if a drag just ended
            if (!isDragging) {
              router.push("/transferringFiles");
            }
          }}
          title="View Active Transfer Status"
        >
          <FaCaretRight className="w-5 h-5 rotate-90" />
        </button>
      )}
    </div>
  );
}
