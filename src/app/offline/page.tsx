import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100  p-4">
      <h1 className="text-2xl  ">No internet</h1>
      <p className="text-lg">
        You are currently offline. Please check your internet connection.
      </p>
      <p className="text-lg">This page is for offline use only.</p>
    </div>
  );
};

export default page;
