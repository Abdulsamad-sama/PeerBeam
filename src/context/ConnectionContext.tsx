"use client";

// ConnectionContext.tsx
// This context manages the connection state for the application

import React, { createContext, useState, useContext, ReactNode } from "react";

type ConnectionContextType = {
  isConnected: boolean;
  roomId: string;
  setRoomId: (id: string) => void;
  setIsConnected: (isConnected: boolean) => void;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState("");

  return (
    <ConnectionContext.Provider
      value={{ isConnected, setIsConnected, roomId, setRoomId }}
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
