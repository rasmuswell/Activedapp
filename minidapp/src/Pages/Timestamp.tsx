import { useEffect, useState } from "react";
import { initWebSocket } from "../services/websocketClient";
import { appContext } from "../AppContext";

export const Timestamp = () => {
  const [status] = useState("Not connected");

  useEffect(() => {
    initWebSocket();
  }, []);

  const handleTimestamp = () => {};

  return (
    <div className="text-white">
      <h1>Run Time Stamp</h1>
      <button className="border-[1px]" onClick={handleTimestamp}>
        Run Timestamp
      </button>
      <pre style={{ textAlign: "left", maxWidth: "800px" }}>{status}</pre>
    </div>
  );
};
