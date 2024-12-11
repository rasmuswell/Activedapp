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
