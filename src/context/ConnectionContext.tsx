"use client";

// ConnectionContext.tsx
// This context manages the connection state for the application

import React, { createContext, useState, useContext, ReactNode } from "react";

type ConnectionContextType = {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <ConnectionContext.Provider value={{ isConnected, setIsConnected }}>
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
