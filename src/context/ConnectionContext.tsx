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
  setIsConnected: (isConnected: boolean) => void;
  roomId: string;
  setRoomId: (id: string) => void;
  socket: Socket | null;
  joinSenderRoom: (senderUid: string, timeoutMs?: number) => Promise<void>;
  createSenderRoom: () => string | undefined;
  isReJoinAttempted: boolean;
  setIsRejoinAttempted: (isreJoinAttempted: boolean) => void;
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
  const [isReJoinAttempted, setIsRejoinAttempted] = useState(false);
  const reconnectingRef = useRef(false);

  // Keys used for persistence
  const STORAGE_RECEIVER = "receiverId";
  const STORAGE_SENDER = "joinedSenderId";

  useEffect(() => {
    const base_url =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";
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
        setIsRejoinAttempted(true);
        return;
      }

      // Use ack-based join so server confirms membership
      reconnectingRef.current = true;
      s.emit(
        "receiver-join",
        { uid: storedReceiver, sender_uid: storedSender },
        (ack: any) => {
          reconnectingRef.current = false;
          setIsRejoinAttempted(true);
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
        setIsRejoinAttempted,
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
