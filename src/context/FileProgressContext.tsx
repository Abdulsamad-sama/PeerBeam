"use client";

// FileProgressContext.tsx
// This context manages the file progress state for the application

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";

type FileProgressEntry = { name: string; progress: number };

type FileProgressContextType = {
  // All files currently tracked (including those at 100% until explicitly removed)
  files: FileProgressEntry[];
  // Filtered list of files currently being transferred (progress < 100)
  activeTransfers: FileProgressEntry[];
  updateFileProgress: (name: string, progress: number) => void;
  // Function to remove a file's entry after it is fully processed (sent/received)
  markFileComplete: (fileName: string) => void;
};

const FileProgressContext = createContext<FileProgressContextType | undefined>(
  undefined
);

export const FileProgressProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<FileProgressEntry[]>([]);

  // 💡 Derived State: Filter the main array to show only currently transferring files
  const activeTransfers = useMemo(() => {
    return files.filter((file) => file.progress < 100);
  }, [files]);

  // Update progress for a specific file, or add it if it doesn't exist
  const updateFileProgress = useCallback(
    (name: string, progress: number) => {
      setFiles((prevFiles) => {
        const fileIndex = prevFiles.findIndex((file) => file.name === name);
        if (fileIndex !== -1) {
          // If file exists, update its progress
          const updatedFiles = [...prevFiles];
          updatedFiles[fileIndex] = { ...updatedFiles[fileIndex], progress };
          return updatedFiles;
        }
        // If file doesn't exist, add it
        return [...prevFiles, { name, progress }];
      });
    },
    []
  );

  // 💡 New: Remove file from the tracking array once it's complete
  const markFileComplete = useCallback((fileName: string) => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  }, []);

  const value = {
    files,
    activeTransfers,
    updateFileProgress,
    markFileComplete,
  };

  return (
    <FileProgressContext.Provider value={value}>
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