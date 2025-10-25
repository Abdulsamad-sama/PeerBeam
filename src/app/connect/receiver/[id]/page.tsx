"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useConnection } from "@/context/ConnectionContext";

type FileTransfer = {
  name: string;
  size: number;
  receivedBuffer: Uint8Array[];
  progress: number;
  isComplete: boolean;
};

const ReceivingFilesPage = ({ params }: { params: { id: string } }) => {
  const { roomId } = useConnection(); // Get the roomId from the context
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [files, setFiles] = useState<FileTransfer[]>([]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    // Join the room to start receiving files
    newSocket.emit("receiver-join", { uid: roomId });

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
                receivedBuffer: [...file.receivedBuffer, new Uint8Array(chunk)],
                progress: file.progress + chunk.byteLength,
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
              Progress: {((file.progress / file.size) * 100).toFixed(2)}%
            </p>
            {/* {file.isComplete && ( */}
            <button
              onClick={() => handleDownload(file)}
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

// ------------------------------------------------------------------------------
// "use client";

// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import { useConnection } from "@/context/ConnectionContext";

// const ReceivingFilesPage = ({ params }: { params: { id: string } }) => {
//   const { roomId } = useConnection(); // Get the roomId from the context
//   const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
//   const [fileName, setFileName] = useState("");
//   const [fileSize, setFileSize] = useState(0);
//   const [receivedBuffer, setReceivedBuffer] = useState<Uint8Array[]>([]);
//   const [receivedProgress, setReceivedProgress] = useState(0);
//   const [isTransferComplete, setIsTransferComplete] = useState(false);

//   useEffect(() => {
//     const newSocket = io("http://localhost:3001");
//     setSocket(newSocket);

//     // Join the room to start receiving files
//     newSocket.emit("receiver-join", { uid: roomId });

//     // Listen for file metadata
//     newSocket.on("file-meta", (metadata) => {
//       console.log("File metadata received:", metadata);
//       setFileName(metadata.name);
//       setFileSize(metadata.size);
//       setReceivedBuffer([]);
//       setReceivedProgress(0);
//       setIsTransferComplete(false);
//     });

//     // Listen for file chunks
//     newSocket.on("file-raw", (data) => {
//       console.log("File chunk received:", data);
//       setReceivedBuffer((prevBuffer) => [...prevBuffer, new Uint8Array(data)]);
//       setReceivedProgress((prev) => prev + data.byteLength);
//     });

//     // Listen for transfer completion
//     newSocket.on("file-complete", () => {
//       console.log("File transfer complete");
//       setIsTransferComplete(true);
//       console.log(isTransferComplete);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [roomId]);

//   // Handle file download
//   const handleDownload = () => {
//     const blob = new Blob(receivedBuffer, { type: "application/octet-stream" });
//     const downloadUrl = URL.createObjectURL(blob);

//     // Trigger file download
//     const a = document.createElement("a");
//     a.href = downloadUrl;
//     a.download = fileName;
//     a.click();
//     URL.revokeObjectURL(downloadUrl);
//   };

//   return (
//     <div className="relative flex flex-col p-10 h-full dark:bg-gray-900">
//       <h1 className="text-2xl md:text-3xl font-extrabold">Receiving Files</h1>

//       {fileName && (
//         <div className="mt-4">
//           <p className="text-lg">Receiving: {fileName}</p>
//           <p className="text-sm">
//             Size: {(fileSize / (1024 * 1024)).toFixed(2)} MB
//           </p>
//           <p className="text-sm">
//             Progress: {((receivedProgress / fileSize) * 100).toFixed(2)}%
//           </p>
//         </div>
//       )}

//       {/* {isTransferComplete && ( */}
//       <button
//         onClick={handleDownload}
//         className="mt-4 p-2 bg-green-500 text-white rounded-lg"
//       >
//         Download File
//       </button>
//       {/* )} */}
//     </div>
//   );
// };

// export default ReceivingFilesPage;
