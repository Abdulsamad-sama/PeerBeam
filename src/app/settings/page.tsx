import React from "react";
import BackToHomeBtn from "@/components/backtohomebtn/BackToHomeBtn";

const settings = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <BackToHomeBtn />
      <h1 className="text-2xl font-bold">Settings Page</h1>
      <p>This is the settings page of the application.</p>
      <div>
        <h2>Edit UserName</h2>
      </div>
      <div>
        <h2>Edit avater</h2>
      </div>
      <div>
        <h2>Theme</h2>
      </div>
      <div>
        <h2>Clear History</h2>
      </div>
      <div>
        <h3>version</h3>
      </div>
    </div>
  );
};

export default settings;
