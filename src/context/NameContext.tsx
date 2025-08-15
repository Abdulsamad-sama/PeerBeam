"use client";
import React, { createContext, useContext, useState } from "react";

const DEFAULT_NAME = "Username";

type NameContextType = {
  userName: string;
  setUserName: (userName: string) => void;
};

const NameContext = createContext<NameContextType>({
  userName: DEFAULT_NAME,
  setUserName: () => {},
});

export const NameProvider = ({ children }: { children: React.ReactNode }) => {
  const [userName, setUserName] = useState<string>(DEFAULT_NAME);
  return (
    <NameContext.Provider value={{ userName, setUserName }}>
      {children}
    </NameContext.Provider>
  );
};

export const useName = () => useContext(NameContext);
