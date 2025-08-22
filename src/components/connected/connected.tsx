"use client";
//THIS CODE LET USERS KNOW IF THE ARE CONNECTED OR NOT

import React from "react";
import { useState } from "react";
import { useConnection } from "@/context/ConnectionContext";

const connected = () => {
  const { isConnected } = useConnection();
  return (
    <div
      className={`flex items-center gap-1 w-fit text-lg ${
        isConnected ? "bg-green-100" : "bg-gray-300"
      } p-1 rounded-md`}
    >
      {isConnected ? <p>Connected</p> : <p>Connect</p>}
      <div
        className={`h-2.5 w-2.5 m-2 ${
          isConnected ? "bg-green-500" : "bg-red-500 -500"
        } rounded-full`}
      ></div>
    </div>
  );
};

export default connected;
