"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useConnection } from "@/context/ConnectionContext";
import BackBtn from "@/components/BackBtn/BackBtn";

type FileTransfer = {
  name: string;
  size: number;
  receivedBuffer: ArrayBuffer[];
  progress: number;
  isComplete: boolean;
};

const ReceivingFilesPage = () => {
  const { roomId, isConnected, socket } = useConnection();
  const [files, setFiles] = useState<FileTransfer[]>([]);
  const router = useRouter();

  // If connection is lost, redirect back to the join page.
  useEffect(() => {
    if (!isConnected || !roomId) {
      router.replace("/connect");
    }
  }, [isConnected, roomId, router]);

  // Function to handle the download of a file
  const handleDownload = useCallback((file: FileTransfer) => {
    const blob = new Blob(file.receivedBuffer, {
      type: "application/octet-stream",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  }, []);

  // 2. Socket Listener Effect
  useEffect(() => {
    // If  we are not in a room/conected, exit.
    if (!socket || !roomId) {
      return;
    }

    // Listen for file metadata
    const handleFileMeta = (metadata: { name: string; size: number }) => {
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
    };

    // Listen for file chunks
    const handleFileRaw = ({
      name,
      chunk,
    }: {
      name: string;
      chunk: ArrayBuffer;
    }) => {
      setFiles((prevFiles) =>
        prevFiles.map((file) => {
          if (file.name === name) {
            const newBuffer = new Uint8Array(chunk).buffer as ArrayBuffer;

            // Calculate current total size
            const currentTotalReceived = file.receivedBuffer.reduce(
              (acc, buffer) => acc + buffer.byteLength,
              0
            );
            const newTotalReceived =
              currentTotalReceived + newBuffer.byteLength;

            let calculatedProgress = (newTotalReceived / file.size) * 100;

            // Ensure progress is visually correct but stays below 100% until complete event
            const progressValue = Math.min(calculatedProgress, 99.9);

            return {
              ...file,
              receivedBuffer: [...file.receivedBuffer, newBuffer],
              progress: progressValue,
            };
          }
          return file;
        })
      );
    };

    // Listen for transfer completion (Fixes 100% progress and enables auto-download)
    const handleFileComplete = (name: string) => {
      console.log(`File transfer complete: ${name}`);
      setFiles((prevFiles) => {
        const completedFile = prevFiles.find((f) => f.name === name);

        // 💡 Set 100% and auto-download
        if (completedFile && completedFile.receivedBuffer.length > 0) {
          handleDownload(completedFile); // Auto-download immediately

          // Update state to show 100% completion and mark as complete
          return prevFiles.map((file) =>
            file.name === name
              ? { ...file, isComplete: true, progress: 100 } // 👈 Set to 100%
              : file
          );
        }

        return prevFiles.map((file) =>
          file.name === name
            ? { ...file, isComplete: true, progress: 100 }
            : file
        );
      });
    };

    socket.on("file-meta", handleFileMeta);
    socket.on("file-raw", handleFileRaw);
    socket.on("file-complete", handleFileComplete);

    return () => {
      // 💡 ONLY remove listeners from the managed socket
      socket.off("file-meta", handleFileMeta);
      socket.off("file-raw", handleFileRaw);
      socket.off("file-complete", handleFileComplete);
    };
    // 💡 Dependencies include socket and handleDownload to ensure listeners are correct
  }, [roomId, socket, handleDownload]);

  return (
    <div className="relative flex flex-col p-4 md:p-10 h-full dark:bg-gray-900 bg-gray-50 text-gray-800 dark:text-gray-200">
      <BackBtn />
      <h1 className="text-3xl font-extrabold text-center mb-8">
        Receiving Files
      </h1>

      <div className="flex justify-center mb-4">
        <span
          className={`px-4 py-2 rounded-full font-semibold text-sm ${
            isConnected
              ? "bg-green-500 text-white"
              : "bg-yellow-500 text-gray-800"
          }`}
        >
          Status: {isConnected ? "Connected" : "Connecting..."}
        </span>
      </div>

      <ul className="mt-4 space-y-4">
        {files.length === 0 && (
          <p className="text-center text-lg text-gray-500 dark:text-gray-400">
            Waiting for sender to initiate transfer...
          </p>
        )}
        {files.map((file, index) => (
          <li
            key={index}
            className="p-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <p className="text-xl font-semibold mb-1 truncate">{file.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>

            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    file.progress === 100 ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${file.progress.toFixed(1)}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium mt-1 text-right">
                {/* {file.isComplete ? 'Complete' : (file.progress.toFixed(1))}% */}
                {file.progress.toFixed(1)}%
              </p>
            </div>

            {/* Manual Download Button (Optional, since it's auto-downloaded) */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceivingFilesPage;

// "use client";

// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import { useConnection } from "@/context/ConnectionContext";
// import { useRouter } from "next/navigation";

// type FileTransfer = {
//   name: string;
//   size: number;
//   receivedBuffer: ArrayBuffer[];
//   isComplete: boolean;
// };

// const ReceivingFilesPage = () => {
//   const { roomId, isConnected, socket } = useConnection();

//   const [files, setFiles] = useState<FileTransfer[]>([]);
//   const [progress, setProgress] = useState<any>([]);
//   const router = useRouter();

//   useEffect(() => {
//     if (!socket || !roomId) return;

//     const newSocket = socket;
//     // Join the room to start receiving files
//     // newSocket.emit("receiver-join", { uid: roomId });
//     newSocket.on("file-progress", (progressData) => {
//       setProgress((prevFiles: any) => [
//         ...prevFiles,
//         {
//           name: progressData.name,
//           progress: progressData.progress,
//         },
//       ]);
//     });

//     // Listen for file metadata
//     newSocket.on("file-meta", (metadata) => {
//       console.log("File metadata received:", metadata);
//       setFiles((prevFiles) => [
//         ...prevFiles,
//         {
//           name: metadata.name,
//           size: metadata.size,
//           receivedBuffer: [],
//           progress: 0,
//           isComplete: false,
//         },
//       ]);
//     });

//     // Listen for file chunks
//     newSocket.on("file-raw", ({ name, chunk }) => {
//       console.log("File chunk received:", name);
//       setFiles((prevFiles) =>
//         prevFiles.map((file) =>
//           file.name === name
//             ? {
//                 ...file,
//                 // Store ArrayBuffer instances to satisfy BlobPart typing
//                 receivedBuffer: [
//                   ...file.receivedBuffer,
//                   new Uint8Array(chunk).buffer as ArrayBuffer,
//                 ],
//                 progress: Math.min(
//                   ((file.receivedBuffer.reduce(
//                     (acc, buffer) => acc + buffer.byteLength,
//                     0
//                   ) +
//                     new Uint8Array(chunk).byteLength) /
//                     file.size) *
//                     100,
//                   100
//                 ), // Calculate progress as a percentage
//               }
//             : file
//         )
//       );
//     });

//     // Listen for transfer completion
//     newSocket.on("file-complete", (name) => {
//       console.log(`File transfer complete: ${name}`);
//       setFiles((prevFiles) =>
//         prevFiles.map((file) =>
//           file.name === name ? { ...file, isComplete: true } : file
//         )
//       );
//     });

//     return () => {
//       newSocket.off("file-meta");
//       newSocket.off("file-raw");
//       newSocket.off("file-complete");
//       newSocket.off("file-progress");
//     };
//   }, [roomId, socket]);

//   useEffect(() => {
//     if (!isConnected) router.replace("/connect/receiver");
//   }, [isConnected, roomId, router]);

//   useEffect(() => {
//     if (!socket || !roomId) return;
//   });

//   // Handle file download
//   const handleDownload = (file: FileTransfer) => {
//     const blob = new Blob(file.receivedBuffer, {
//       type: "application/octet-stream",
//     });
//     const downloadUrl = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = downloadUrl;
//     a.download = file.name;
//     a.click();
//     URL.revokeObjectURL(downloadUrl);
//   };

//   return (
//     <div className="relative flex flex-col p-10 h-full dark:bg-gray-900">
//       <h1 className="text-2xl md:text-3xl font-extrabold">Receiving Files</h1>

//       <ul className="mt-4">
//         {files.map((file, index) => (
//           <li key={index} className="mb-4 p-4 border rounded-lg">
//             <p className="text-lg">File: {file.name}</p>
//             <p className="text-sm">
//               Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
//             </p>
//             <p className="text-sm">
//               Progress:{" "}
//               {progress.map((pg: any) => {
//                 if (pg.name === file.name) return pg.progress;
//               })}
//               %
//             </p>
//             {/* {file.isComplete && ( */}
//             <button
//               onClick={() => handleDownload(file)}
//               disabled={progress !== 100.0 ? true : false}
//               className="mt-2 p-2 bg-green-500 text-white rounded-lg"
//             >
//               Download
//             </button>
//             {/* )} */}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ReceivingFilesPage;
