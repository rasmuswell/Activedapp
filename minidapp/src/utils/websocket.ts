import { sendFullToBlockchain } from "../services/blockchain";
import { formatData } from "./fileHandler";
import { initWebSocket, getWebSocket } from "../services/websocketClient";
import { saveToMDSFile } from "../services/minima";

let hasConnectedOnce = false;
let shouldReconnect = false;
const retryDelay = 5000;

const dataArray: string[] = [];

export const nodejsWebsocket = (
  userCommand: "start" | "stop",
  sessionId: string,
  setDataStatus: (status: string) => void,
  setActivityData: (data: string) => void,
  setBlockChainStatus,
  setPendingUid?: (number: number) => void
) => {
  const handleMessage = (type, data: string) => {
    if (type === "data") {
      setDataStatus("Reading data from the EDR (Event Data Recorder).");
      setActivityData(data);
      formatData(sessionId, data);
    } else if (type === "uid") {
      console.log(data);

      const filename = `${sessionId}_uids.md`;
      dataArray.push(data);
      saveToMDSFile(filename, dataArray);
    }
  };

  const retryConnection = () => {
    console.log(`Retrying connection in ${retryDelay / 1000} seconds...`);
    setTimeout(connect, retryDelay);
  };

  const connect = () => {
    if (!shouldReconnect) return;

    const socket: WebSocket = initWebSocket(handleMessage, setBlockChainStatus);

    socket.onopen = () => {
      console.log("Connected to the EDR (Event Data Recorder)");
      setDataStatus("Connected to the EDR (Event Data Recorder)");
      hasConnectedOnce = true;
      socket.send(JSON.stringify({ type: "start", id: sessionId }));
    };

    socket.onclose = () => {
      if (!shouldReconnect) {
        console.log(
          "EDR (Event Data Recorder) closed intentionally, no reconnection."
        );
        return;
      }
      if (hasConnectedOnce) {
        setDataStatus("Disconnected from the EDR (Event Data Recorder)");
        retryConnection();
      }
    };

    socket.onerror = () => {
      console.error("EDR (Event Data Recorder) error: Could not connect.");
      if (!hasConnectedOnce) {
        setDataStatus(
          `Failed to connect to the EDR (Event Data Recorder), retrying in ${
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
      console.log("Stopping EDR (Event Data Recorder) connection...");
      sendFullToBlockchain(sessionId, setPendingUid);
      socket.send(JSON.stringify({ type: "stop", id: sessionId }));
      socket.close();
      setDataStatus("EDR (Event Data Recorder) connection stopped.");
      setBlockChainStatus("Timestamping stopped.");
    } else {
      console.log("No active EDR (Event Data Recorder) connection to stop.");
      setDataStatus("No active EDR (Event Data Recorder) connection to stop.");
    }
  } else if (userCommand === "mysql") {
    console.log("mysql start");
  }
};
