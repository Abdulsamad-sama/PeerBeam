import React from "react";
import QRCode from "react-qr-code";

const connect = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Connect to Device</h1>
      <p>Scan the QR code below to connect to your device:</p>
      <div className="flex justify-center mt-4">
        <QRCode value="https://example.com/connect" size={128} />
      </div>
      <p className="mt-4">
        Follow the instructions on your device to complete the connection.
      </p>
    </div>
  );
};

export default connect;
