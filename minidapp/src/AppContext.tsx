import { createContext, useRef, useEffect, useState } from "react";
import { IActivityData } from "./Interfaces/types";
import { activityBase } from "./utils/objects";
import { checkmode } from "./services/minima";

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
  showSummary: false,
  setShowSummary: (() => {}) as React.Dispatch<React.SetStateAction<boolean>>,
  pendingUid: 0,
  setPendingUid: (() => {}) as React.Dispatch<React.SetStateAction<number>>,
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
  const [sessionId, setSessionIdState] = useState("");
  const [dataStatus, setDataStatus] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [pendingUid, setPendingUid] = useState(0);

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
        showSummary,
        setShowSummary,
        pendingUid,
        setPendingUid,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppProvider;
