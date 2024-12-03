import { createContext, useRef, useEffect, useState } from "react";
import { IActivityData } from "./Interfaces/types";

export const appContext = createContext({
  activityData: {} as IActivityData,
  setActivityData: (() => {}) as React.Dispatch<
    React.SetStateAction<IActivityData>
  >,
  sessionStatus: false,
  setSessionStatus: (() => {}) as React.Dispatch<React.SetStateAction<boolean>>,
  sessionId: "",
  setSessionId: (() => {}) as React.Dispatch<React.SetStateAction<string>>,
  dataStatus: "",
  setDataStatus: (() => {}) as React.Dispatch<React.SetStateAction<string>>,
  activityList: [] as IActivityData[],
  setActivityList: (() => {}) as React.Dispatch<
    React.SetStateAction<IActivityData[]>
  >,
});

interface IProps {
  children: any;
}

const AppProvider = ({ children }: IProps) => {
  const loaded = useRef(false);
  const sessionIdRef = useRef(""); // Create a ref for sessionId

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [activityData, setActivityData] = useState<IActivityData>({
    session_id: "",
    timestamp: "",
    interval: 60,
    message: "",
    full_message: "",
  });
  const [activityList, setActivityList] = useState<IActivityData[]>([]);
  const [sessionStatus, setSessionStatus] = useState(false);
  const [sessionId, setSessionIdState] = useState("");
  const [dataStatus, setDataStatus] = useState("");

  // Update the ref whenever sessionId changes
  const setSessionId = (id: string) => {
    setSessionIdState(id);
    sessionIdRef.current = id; // Keep the ref in sync with state
  };

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      (window as any).MDS.init((msg: any) => {
        if (msg.event === "inited") {
          // do something Minim-y
        }
      });
    }
  }, [loaded]);

  useEffect(() => {
    if (sessionId !== "") {
      connect();
    }
    // Establish WebSocket connection with reconnection
    function connect() {
      const newSocket = new WebSocket("ws://localhost:8765");

      newSocket.onopen = () => {
        console.log("WebSocket connected");
        setSocket(newSocket);
      };

      newSocket.onclose = () => {
        console.log("WebSocket disconnected. Reconnecting...");
        // Attempt to reconnect after 3 seconds
        setTimeout(connect, 3000);
      };

      newSocket.onmessage = (event) => {
        console.log("I want to be able to see that msg here");

        // Parse the JSON string into an object
        const parsedData = JSON.parse(event.data);

        if (parsedData.session_id === sessionIdRef.current) {
          setActivityData(parsedData);
          setDataStatus("Data is being monitored.");
        } else {
          console.log("Wrong session ID");
        }
      };
    }

    // Cleanup function
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [sessionId]);

  return (
    <appContext.Provider
      value={{
        activityData,
        setActivityData,
        sessionStatus,
        setSessionStatus,
        sessionId,
        setSessionId,
        dataStatus,
        setDataStatus,
        activityList,
        setActivityList,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
