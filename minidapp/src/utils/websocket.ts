import { IActivityData } from "../Interfaces/types";
import { sendFullToBlockchain, sendToBlockchain } from "../services/blockchain";
import { saveDataToFile } from "./fileHandler";

let socket: WebSocket | null = null;
let hasConnectedOnce = false; // Track if the connection was ever established
let shouldReconnect = false; // Controls whether to reconnect

export const nodejsWebsocket = (
  userCommand: "start" | "stop",
  sessionId: string,
  setDataStatus: (status: string) => void,
  setActivityData: (data: IActivityData) => void, // Update type to match IActivityData
  setPendingUid: number
) => {
  const retryDelay = 5000;

  const connect = () => {
    // Ensure we're allowed to reconnect
    if (!shouldReconnect) {
      return;
    }

    // Clean up any existing socket
    if (socket) {
      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        console.log(
          "Closing previous WebSocket instance before reconnecting..."
        );
        socket.close();
      }
    }

    socket = new WebSocket("ws://localhost:8765");
    console.log("Attempting to connect to the WebSocket server...");
    setDataStatus("Attempting to connect to the WebSocket server...");

    socket.onopen = () => {
      console.log("Connected to the WebSocket server");
      setDataStatus("Connected to the WebSocket server");
      hasConnectedOnce = true; // Mark that connection was successfully established

      // Send a "start" command to begin data collection
      socket?.send(JSON.stringify({ type: "start", id: sessionId }));
    };

    socket.onmessage = (event) => {
      const data: IActivityData = JSON.parse(event.data);

      if (data) {
        setDataStatus("Reading data from server.");
        setActivityData(data);
        //Save data to file
        saveDataToFile(sessionId, data);
      }
    };

    socket.onclose = () => {
      if (!shouldReconnect) {
        console.log("WebSocket closed intentionally, no reconnection.");
        return;
      }

      if (hasConnectedOnce) {
        console.log("Disconnected from the WebSocket server");
        setDataStatus("Disconnected from the WebSocket server");

        // Retry connection
        retryConnection();
      }
    };

    socket.onerror = () => {
      console.error("WebSocket error: Could not connect to the server");
      if (!hasConnectedOnce) {
        setDataStatus(
          `Failed to connect to the WebSocket server, trying again in ${
            retryDelay / 1000
          } seconds...`
        );
        retryConnection();
      }

      // Close the socket explicitly to trigger proper cleanup
      if (socket?.readyState !== WebSocket.CLOSED) {
        socket?.close();
      }
    };
  };

  const retryConnection = () => {
    console.log(`Retrying connection in ${retryDelay / 1000} seconds...`);
    setTimeout(() => {
      connect();
    }, retryDelay);
  };

  if (userCommand === "start") {
    // Enable reconnection and initiate connection
    shouldReconnect = true;
    connect();
  } else if (userCommand === "stop") {
    // Disable reconnection and close WebSocket
    shouldReconnect = false;
    // Close WebSocket if it exists and is open
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("Stopping WebSocket connection...");
      //Send data in file to blockchain
      sendFullToBlockchain(sessionId, setPendingUid);
      socket.send(JSON.stringify({ type: "stop", id: sessionId }));
      socket.close();
      socket = null;
      setDataStatus("WebSocket connection stopped.");
    } else {
      console.log("No active WebSocket connection to stop.");
      setDataStatus("No active WebSocket connection to stop.");
    }
  }
};
