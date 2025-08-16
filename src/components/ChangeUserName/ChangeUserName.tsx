"use client";
import React, { useState } from "react";
import { useName } from "@/context/NameContext";

const ChangeUserName = () => {
  const { userName, setUserName } = useName();
  const [newName, setNewName] = useState(userName);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      setUserName(newName);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex pl-6 items-center gap-6 h-full"
    >
      <input
        type="text"
        value={newName}
        onChange={handleChange}
        className="border p-2 rounded"
        placeholder="Enter new username"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">
        Change Username
      </button>
    </form>
  );
};

export default ChangeUserName;
