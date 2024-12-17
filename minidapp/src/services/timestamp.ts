import { getWebSocket } from "./websocketClient";

export const sendToTimeStamp = (data) => {
  const socket = getWebSocket();
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "mysql",
        data: data,
      })
    );
  } else {
    console.log("WebSocket not ready.");
  }
};
