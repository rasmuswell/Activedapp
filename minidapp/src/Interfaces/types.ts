export interface AppContextType {
  activityData: IActivityData;
  setActivityData: React.Dispatch<React.SetStateAction<IActivityData>>;
  sessionStatus: boolean;
  setSessionStatus: React.Dispatch<React.SetStateAction<boolean>>;
  sessionId: string;
  setSessionId: (id: string) => void;
  reviewId: string;
  setReviewId: React.Dispatch<React.SetStateAction<string>>;
  dataStatus: string;
  setDataStatus: React.Dispatch<React.SetStateAction<string>>;
  blockChainStatus: string;
  setBlockChainStatus: React.Dispatch<React.SetStateAction<string>>;
  activityList: IActivityData[];
  setActivityList: React.Dispatch<React.SetStateAction<IActivityData[]>>;
  showSummary: boolean;
  setShowSummary: React.Dispatch<React.SetStateAction<boolean>>;
  pendingUid: number;
  setPendingUid: React.Dispatch<React.SetStateAction<number>>;
  timeConnected: string;
  setTimeConnected: React.Dispatch<React.SetStateAction<string>>;
  fileData: string | ArrayBuffer;
  setFileData: React.Dispatch<React.SetStateAction<string | ArrayBuffer>>;
}

export interface IActivityData {
  timestamp: string;
  sessionId: string;
  cpuUsage: string;
  memoryUsage: number;
  actions: number;
}

export interface IActivityList {
  activityList: [];
}

export interface DataPoint {
  timestamp: string;
  sessionId: string;
  cpuUsage: string;
  memoryUsage: number;
  actions: number;
}

export interface StatsChartProps {
  data: DataPoint[];
}
