"use client";
import React, { useState } from "react";
import QRCode from "react-qr-code";
import { TbQrcodeOff } from "react-icons/tb";

const page = () => {
  // const [isMis, setIsMis] = useState(false);
  return (
    <div>
      {QRCode && (
        <div>
          <div className="flex items-center justify-center mt-6">
            <QRCode value="couldnt connect" />
          </div>
          <hr className="my-6" />
          <h1 className="text-2xl font-bold">Connect Page</h1>
          <p className="text-lg mb-6">
            connect to another device by scanning the QR code or entering the
            code manually.
          </p>
          <hr className="my-6" />
        </div>
      )}

      {!QRCode && (
        <div>
          <div className="flex items-center justify-center mt-6">
            <TbQrcodeOff className="text-[18rem]" />
          </div>
          <p>
            Unable to generate the QR code to connect due to the following
            issues. Please fix it and try again later.
          </p>
        </div>
      )}
    </div>
  );
};

export default page;
