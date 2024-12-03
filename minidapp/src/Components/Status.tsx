import React from "react";

export const Status = ({ set, msg }) => {
  return (
    <div className="border-[2px] w-[40%]">
      {set} status: {msg}
    </div>
  );
};
