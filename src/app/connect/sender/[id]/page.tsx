import React from "react";

const page = ({ params }: { params: any }) => {
  return (
    <div>
      Receiver Page ID: {params.id}
      <div className="flex gap-2 justify-center">
        <div id="container" className="flex">
          <span>0%</span>
          <h1>Filename</h1>
          <p>file-size</p>
        </div>
      </div>
    </div>
  );
};

export default page;
