"use client";
import React from "react";
import { useAvatar } from "@/context/AvatarContext";
import { FaPlus } from "react-icons/fa6";

const ChangeAvatar = () => {
  const { avatar, setAvatar } = useAvatar();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  return (
    <div className="flex pl-6 items-center gap-6 h-full">
      {avatar && (
        <img
          src={avatar}
          alt="User avatar preview"
          className="mt-2 mr-6 w-15 h-15 rounded-full object-cover border"
        />
      )}

      <div className=" relative overflow-hidden flex items-center gap-4 h-10 p-4 border rounded border-gray-500 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          aria-label="user avatar"
          onChange={handleAvatarChange}
          className="absolute opacity-0"
        />
        <div className=" flex items-center">
          <FaPlus className="mr-1" />
          <p className="cursor-pointer ">Choose from files</p>
        </div>
      </div>
    </div>
  );
};

export default ChangeAvatar;
