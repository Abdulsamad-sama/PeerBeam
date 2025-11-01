"use client";
import { useAvatar } from "@/context/AvatarContext";
import Image from "next/image";
const UserAvatar = () => {
  const { avatar } = useAvatar();

  return (
    <Image
      src={avatar ?? "/user2.png"}
      height={50}
      width={50}
      alt="User Avatar"
      className="w-12 h-12 rounded-full object-cover border-1 border-gray-400"
    />
  );
};

export default UserAvatar;
