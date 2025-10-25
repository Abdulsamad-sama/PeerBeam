"use client";

// FileProgressContext.tsx
// This context manages the file progress state for the application

import React, { createContext, useState, useContext, ReactNode } from "react";

type FileProgressContextType = {
  files: { name: string; progress: number }[];
  updateFileProgress: (name: string, progress: number) => void;
};

const FileProgressContext = createContext<FileProgressContextType | undefined>(
  undefined
);

export const FileProgressProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<{ name: string; progress: number }[]>([]);

  const updateFileProgress = (name: string, progress: number) => {
    setFiles((prevFiles) => {
      const fileIndex = prevFiles.findIndex((file) => file.name === name);
      if (fileIndex !== -1) {
        const updatedFiles = [...prevFiles];
        updatedFiles[fileIndex].progress = progress;
        return updatedFiles;
      }
      return [...prevFiles, { name, progress }];
    });
  };

  return (
    <FileProgressContext.Provider value={{ files, updateFileProgress }}>
      {children}
    </FileProgressContext.Provider>
  );
};

export const useFileProgress = () => {
  const context = useContext(FileProgressContext);
  if (!context) {
    throw new Error(
      "useFileProgress must be used within a FileProgressProvider"
    );
  }
  return context;
};
