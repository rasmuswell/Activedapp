import { getWebSocket } from "./websocketClient";

export const sendToTimeStamp = (data) => {
  console.log(data);
  console.log(JSON.stringify(data));

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
