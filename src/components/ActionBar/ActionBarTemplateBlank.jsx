import React from "react";

export default function TEMPLATE({ style: button, setShow }) {
  return (
    <div className="flex flex-row justify-around items-start my-2">
      <div>
        <button className={button}>Action</button>
      </div>
      <div>
        <button className={button}>Action</button>
      </div>
    </div>
  );
}
