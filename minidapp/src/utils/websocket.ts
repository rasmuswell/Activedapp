import { IActivityData } from "../Interfaces/types";
import { sendFullToBlockchain } from "../services/blockchain";
import { formatData } from "./fileHandler";
import { initWebSocket, getWebSocket } from "../services/websocketClient";

let hasConnectedOnce = false;
let shouldReconnect = false;
const retryDelay = 5000;

export const nodejsWebsocket = (
  userCommand: "start" | "stop",
  sessionId: string,
  setDataStatus: (status: string) => void,
  setActivityData: (data: IActivityData) => void,
  setPendingUid?: (number: number) => void
) => {
  const handleMessage = (type, data: IActivityData) => {
    if (type === "data") {
      setDataStatus("Reading data from server.");
      setActivityData(data);
      formatData(sessionId, data);
    } else if (type === "uid") {
      console.log("UID: ", data);
    }
  };

  const retryConnection = () => {
    console.log(`Retrying connection in ${retryDelay / 1000} seconds...`);
    setTimeout(connect, retryDelay);
  };

  const connect = () => {
    if (!shouldReconnect) return;

    const socket: WebSocket = initWebSocket(handleMessage);

    socket.onopen = () => {
      console.log("Connected to the WebSocket server");
      setDataStatus("Connected to the WebSocket server");
      hasConnectedOnce = true;
      socket.send(JSON.stringify({ type: "start", id: sessionId }));
    };

    socket.onclose = () => {
      if (!shouldReconnect) {
        console.log("WebSocket closed intentionally, no reconnection.");
        return;
      }
      if (hasConnectedOnce) {
        setDataStatus("Disconnected from the WebSocket server");
        retryConnection();
      }
    };

    socket.onerror = () => {
      console.error("WebSocket error: Could not connect to the server");
      if (!hasConnectedOnce) {
        setDataStatus(
          `Failed to connect to the WebSocket server, retrying in ${
            retryDelay / 1000
          } seconds...`
        );
        retryConnection();
      }
      if (socket?.readyState !== WebSocket.CLOSED) {
        socket?.close();
      }
    };
  };

  if (userCommand === "start") {
    shouldReconnect = true;
    connect();
  } else if (userCommand === "stop") {
    shouldReconnect = false;
    const socket = getWebSocket();
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("Stopping WebSocket connection...");
      sendFullToBlockchain(sessionId, setPendingUid);
      socket.send(JSON.stringify({ type: "stop", id: sessionId }));
      socket.close();
      setDataStatus("WebSocket connection stopped.");
    } else {
      console.log("No active WebSocket connection to stop.");
      setDataStatus("No active WebSocket connection to stop.");
    }
  } else if (userCommand === "mysql") {
    console.log("mysql start");
  }
};
