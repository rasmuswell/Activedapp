import React from "react";

export const TerminateRecording = ({ dataStatus }) => {
  return (
    <div className="text-gray-400">
      <h2 className="text-center mb-[20px] text-[2rem] text-white">
        Terminate recording
      </h2>
      <p className="text-[white]">
        Confirm that you have terminated the collecting tool before closing the
        recording.
      </p>
      <p className="text-center text-[white] p-2">Status: {dataStatus}</p>
    </div>
  );
};
