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
      className="w-8 h-8 rounded-full object-cover border"
    />
  );
};

export default UserAvatar;
