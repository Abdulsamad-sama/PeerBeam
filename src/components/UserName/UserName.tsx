"use client";
import React from "react";
import { useName } from "@/context/NameContext";

const UserName = () => {
  const { userName } = useName();
  return <h1 className="">{userName || "Usernmame"}</h1>;
};

export default UserName;
