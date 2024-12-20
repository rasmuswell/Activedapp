import { createContext, useRef, useEffect, useState } from "react";
import { AppContextType, IActivityData } from "./Interfaces/types";
import { activityBase } from "./utils/objects";
import { checkmode, checkStatus } from "./services/minima";

export const appContext = createContext<AppContextType>({
  activityData: {} as IActivityData,
  setActivityData: () => {},
  sessionStatus: false,
  setSessionStatus: () => {},
  sessionId: "",
  setSessionId: () => {},
  reviewId: "",
  setReviewId: () => {},
  dataStatus: "",
  setDataStatus: () => {},
  blockChainStatus: "",
  setBlockChainStatus: () => {},
  activityList: [],
  setActivityList: () => {},
  showSummary: false,
  setShowSummary: () => {},
  pendingUid: 0,
  setPendingUid: () => {},
  timeConnected: "",
  setTimeConnected: () => {},
  fileData: "",
  setFileData: (() => {}) as React.Dispatch<
    React.SetStateAction<string | ArrayBuffer>
  >,
});

interface IProps {
  children: any;
}

const AppProvider = ({ children }: IProps) => {
  const loaded = useRef(false);
  const sessionIdRef = useRef(""); // Create a ref for sessionId

  const [activityData, setActivityData] = useState<IActivityData>(activityBase);
  const [activityList, setActivityList] = useState<IActivityData[]>([]);
  const [sessionStatus, setSessionStatus] = useState(false);
  const [sessionId, setSessionIdState] = useState<string>("");
  const [reviewId, setReviewId] = useState("");
  const [dataStatus, setDataStatus] = useState("");
  const [blockChainStatus, setBlockChainStatus] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [pendingUid, setPendingUid] = useState(0);
  const [timeConnected, setTimeConnected] = useState("");
  const [fileData, setFileData] = useState<string | ArrayBuffer>("");

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
          checkmode();
        }
      });
    }
  }, [loaded]);

  useEffect(() => {
    if (blockChainStatus === "") {
      const runCmds = async () => {
        const time = await checkStatus();
        setTimeConnected(time);
        setBlockChainStatus(`Connection established at ${time}`);
      };
      runCmds();
    }
  }, []);

  useEffect(() => {
    if (
      activityData.sessionId !== "" &&
      !activityList.some((item) => item.timestamp === activityData.timestamp)
    ) {
      setActivityList((prevData) => [...prevData, activityData]);
    }
  }, [activityData]);

  return (
    <appContext.Provider
      value={{
        activityData,
        setActivityData,
        sessionStatus,
        setSessionStatus,
        sessionId,
        setSessionId,
        reviewId,
        setReviewId,
        fileData,
        setFileData,
        dataStatus,
        setDataStatus,
        blockChainStatus,
        setBlockChainStatus,
        activityList,
        setActivityList,
        showSummary,
        setShowSummary,
        pendingUid,
        setPendingUid,
        timeConnected,
        setTimeConnected,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
