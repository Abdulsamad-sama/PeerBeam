"use client";

import React, { createContext, useContext, useState } from "react";

const DEFAULT_AVATAR = "/user2.png";

type AvatarContextType = {
  avatar: string;
  setAvatar: (img: string) => void;
};

const AvatarContext = createContext<AvatarContextType>({
  avatar: DEFAULT_AVATAR,
  setAvatar: () => {},
});

export const AvatarProvider = ({ children }: { children: React.ReactNode }) => {
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
  return (
    <AvatarContext.Provider value={{ avatar, setAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => useContext(AvatarContext);
