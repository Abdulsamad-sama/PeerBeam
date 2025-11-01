"use client";

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";

type ConnectionContextType = {
  isConnected: boolean;
  roomId: string;
  setRoomId: (id: string) => void;
  setIsConnected: (isConnected: boolean) => void;
  socket: Socket | null;
  joinSenderRoom: (senderUid: string, timeoutMs?: number) => Promise<void>;
  createSenderRoom: () => string | undefined;
  isReJoinAttempted: boolean;
  setIsRejoinattempted: (isreJoinAttempted: boolean) => void;
  isLoading: boolean;
  leaveRoom: () => void;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

const generateId = () =>
  `${Math.trunc(Math.random() * 999)}-${Math.trunc(
    Math.random() * 999
  )}-${Math.trunc(Math.random() * 999)}`;

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false); // reflects joined state (socket + server ack)
  const [roomId, setRoomId] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isReJoinAttempted, setIsRejoinattempted] = useState(false);
  const reconnectingRef = useRef(false);

  // Keys used for persistence
  const STORAGE_RECEIVER = "receiverId";
  const STORAGE_SENDER = "joinedSenderId";

  useEffect(() => {
    const base_url = process.env.PUBLIC_SOCKET_URL || “https://peerbeam.onrender.com”;
    const s = io(base_url, { autoConnect: true });
    setSocket(s);

    // Attempt to re-join if we have persisted join info when socket connects
    const tryRejoin = () => {
      const storedReceiver = localStorage.getItem(STORAGE_RECEIVER);
      const storedSender = localStorage.getItem(STORAGE_SENDER);

      if (!storedReceiver || !storedSender) {
        // nothing to rejoin — reflect connected but not joined
        setIsConnected(false);
        setRoomId("");
        setIsRejoinattempted(true);
        return;
      }

      // Use ack-based join so server confirms membership
      reconnectingRef.current = true;
      s.emit(
        "receiver-join",
        { uid: storedReceiver, sender_uid: storedSender },
        (ack: any) => {
          reconnectingRef.current = false;
          setIsRejoinattempted(true);
          if (ack && ack.success) {
            setRoomId(storedSender);
            setIsConnected(true);
          } else {
            // server says sender not present / join failed -> clear persisted
            localStorage.removeItem(STORAGE_RECEIVER);
            localStorage.removeItem(STORAGE_SENDER);
            setRoomId("");
            setIsConnected(false);
          }
        }
      );
    };

    s.on("connect", () => {
      // only attempt rejoin once per connection cycle
      if (!isConnected && !isReJoinAttempted && !reconnectingRef.current) {
        tryRejoin();
      }
    });

    s.on("disconnect", () => {
      // low-level socket disconnect means not joined for now
      setIsConnected(false);
    });

    // Optional server events that may be used elsewhere
    s.on("init", () => {
      // sender notified receiver joined — not used here
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // join a sender room (receiver flow)
  const joinSenderRoom = (senderUid: string, timeoutMs = 5000) => {
    if (!socket) return Promise.reject(new Error("Socket not initialized."));
    if (!socket.connected)
      return Promise.reject(new Error("Socket not connected."));

    const receiverId = generateId();

    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Join request timed out."));
      }, timeoutMs);

      socket.emit(
        "receiver-join",
        { uid: receiverId, sender_uid: senderUid },
        (ack: any) => {
          clearTimeout(timer);
          if (ack && ack.success) {
            try {
              localStorage.setItem(STORAGE_RECEIVER, receiverId);
              localStorage.setItem(STORAGE_SENDER, senderUid);
              setRoomId(senderUid);
              setIsConnected(true);
              resolve();
            } catch (err) {
              reject(new Error("Failed to persist join state."));
            }
          } else {
            reject(new Error(ack?.message || "Failed to join sender room."));
          }
        }
      );
    });
  };

  //create a sender room (sender flow)
  const createSenderRoom = (): string | undefined => {
    console.log("context clicked");
    if (!socket || !socket.connected) {
      console.error("Socket not connected. cannot create sender room.");
      return undefined;
    }
    const newRoomId: string = generateId();
    setRoomId(newRoomId);
    socket.emit("sender-join", { uid: newRoomId });
    return newRoomId;
  };

  // leave room and clear persisted join info
  const leaveRoom = () => {
    const storedReceiver = localStorage.getItem(STORAGE_RECEIVER);
    const storedSender = localStorage.getItem(STORAGE_SENDER);

    if (socket && socket.connected && storedReceiver && storedSender) {
      socket.emit("receiver-leave", {
        uid: storedReceiver,
        sender_uid: storedSender,
      });
    }

    localStorage.removeItem(STORAGE_RECEIVER);
    localStorage.removeItem(STORAGE_SENDER);
    setRoomId("");
    setIsConnected(false);
  };

  return (
    <ConnectionContext.Provider
      value={{
        isConnected,
        setIsConnected,
        roomId,
        setRoomId,
        socket,
        joinSenderRoom,
        createSenderRoom,
        isReJoinAttempted,
        setIsRejoinattempted,
        isLoading: !isReJoinAttempted,
        leaveRoom,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};

// "use client";

// // ConnectionContext.tsx
// // Manage socket instance, connection state and room join persistence.
// // Ensures isConnected reflects whether client is actually connected AND joined.
// import React, {
//   createContext,
//   useState,
//   useContext,
//   ReactNode,
//   useEffect,
// } from "react";
// import { io, Socket } from "socket.io-client";

// type ConnectionContextType = {
//   isConnected: boolean;
//   roomId: string;
//   setRoomId: (id: string) => void;
//   setIsConnected: (isConnected: boolean) => void;
//   socket: Socket | null;
//   joinSenderRoom: (senderUid: string, timeoutMs?: number) => Promise<void>;
//   leaveRoom: () => void;
// };

// const ConnectionContext = createContext<ConnectionContextType | undefined>(
//   undefined
// );

// const generateId = () =>
//   `${Math.trunc(Math.random() * 999)}-${Math.trunc(
//     Math.random() * 999
//   )}-${Math.trunc(Math.random() * 999)}`;

// export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [roomId, setRoomId] = useState("");
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     const base_url = process.env.PUBLIC_SOCKET_URL || "http://localhost:3001";
//     const s = io(base_url, { autoConnect: true });
//     setSocket(s);

//     // On low level connect/disconnect update isConnected only if we still have a joined room
//     s.on("connect", () => {
//       const storedSender = localStorage.getItem("joinedSenderId");
//       const storedReceiver = localStorage.getItem("receiverId");
//       // If we previously joined, attempt to rejoin so server confirms membership.
//       if (storedSender && storedReceiver) {
//         s.emit(
//           "receiver-join",
//           { uid: storedReceiver, sender_uid: storedSender },
//           (ack: any) => {
//             if (ack && ack.success) {
//               setRoomId(storedSender);
//               setIsConnected(true);
//             } else {
//               setRoomId("");
//               setIsConnected(false);
//               localStorage.removeItem("joinedSenderId");
//               localStorage.removeItem("receiverId");
//             }
//           }
//         );
//       } else {
//         // not joined to a room — reflect socket connection but not joined
//         setIsConnected(false);
//       }
//     });

//     s.on("disconnect", () => {
//       // socket disconnected -> not joined
//       setIsConnected(false);
//     });

//     // optional: server may emit init or other events; keep them if needed
//     s.on("init", () => {
//       // server signalled a new receiver joined (sender's page)
//     });

//     return () => {
//       s.disconnect();
//     };
//   }, []);

//   // joinSenderRoom centralised here so isConnected and persistence handled consistently
//   const joinSenderRoom = (senderUid: string, timeoutMs = 5000) => {
//     if (!socket) {
//       return Promise.reject(
//         new Error("Socket not initialized. Cannot join sender room.")
//       );
//     }
//     if (!socket.connected) {
//       return Promise.reject(new Error("Socket is not connected to server."));
//     }
//     const receiverId = generateId();

//     return new Promise<void>((resolve, reject) => {
//       const timer = setTimeout(() => {
//         reject(new Error("Join request timed out."));
//       }, timeoutMs);

//       socket.emit(
//         "receiver-join",
//         { uid: receiverId, sender_uid: senderUid },
//         (ack: any) => {
//           clearTimeout(timer);
//           if (ack && ack.success) {
//             // persist so we can auto-rejoin on reconnect
//             try {
//               localStorage.setItem("receiverId", receiverId);
//               localStorage.setItem("joinedSenderId", senderUid);
//               setRoomId(senderUid);
//               setIsConnected(true);
//               resolve();
//             } catch (err) {
//               reject(new Error("Failed to update connection state."));
//             }
//           } else {
//             reject(new Error(ack?.message || "Failed to join sender room."));
//           }
//         }
//       );
//     });
//   };

//   const leaveRoom = () => {
//     // clear persisted join and update states
//     const storedReceiver = localStorage.getItem("receiverId");
//     const storedSender = localStorage.getItem("joinedSenderId");
//     if (socket && socket.connected && storedReceiver && storedSender) {
//       // Tell server we're leaving (server may ignore; implement server-side handling if desired)
//       socket.emit("receiver-leave", {
//         uid: storedReceiver,
//         sender_uid: storedSender,
//       });
//     }
//     localStorage.removeItem("receiverId");
//     localStorage.removeItem("joinedSenderId");
//     setRoomId("");
//     setIsConnected(false);
//   };

//   return (
//     <ConnectionContext.Provider
//       value={{
//         isConnected,
//         setIsConnected,
//         roomId,
//         setRoomId,
//         socket,
//         joinSenderRoom,
//         leaveRoom,
//       }}
//     >
//       {children}
//     </ConnectionContext.Provider>
//   );
// };

// export const useConnection = () => {
//   const context = useContext(ConnectionContext);
//   if (!context) {
//     throw new Error("useConnection must be used within a ConnectionProvider");
//   }
//   return context;
// };
