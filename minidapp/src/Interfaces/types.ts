export interface IActivityData {
  session_id: string;
  timestamp: string;
  interval: number;
  message: string;
  full_message: string;
}

interface IActivityList {
  activityList: [];
}
