export interface IActivityData {
  timestamp: string;
  sessionId: string;
  cpuUsage: number;
  memoryUsage: number;
  actions: number;
}

export interface IActivityList {
  activityList: [];
}
