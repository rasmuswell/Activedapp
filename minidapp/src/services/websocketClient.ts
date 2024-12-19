import { IActivityData } from "../Interfaces/types";

let socket: WebSocket | null = null;

export const initWebSocket = (
  onMessage: (type: string, data: IActivityData) => void
): WebSocket => {
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    console.log("WebSocket already initialized.");
    return socket;
  }

  socket = new WebSocket("ws://localhost:8765");

  socket.onopen = () => {
    console.log("WebSocket connected.");
  };

  socket.onmessage = (data) => {
    // console.log(data.data);

    try {
      const parsedMessage = JSON.parse(data.data);

      switch (parsedMessage.type) {
        case "message":
          // console.log("MESSAGE", parsedMessage.message.data);
          onMessage("data", parsedMessage.message.data);
          break;

        case "uid":
          // console.log("UID", parsedMessage.data.data);
          onMessage("uid", parsedMessage.data.data);
          break;

        default:
          console.warn("Unknown message type:", parsedMessage.type);
      }
    } catch (err) {
      console.error("Error parsing message:", err);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket closed.");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
};

export const getWebSocket = () => {
  // console.log("Socket:", socket);

  return socket;
};
