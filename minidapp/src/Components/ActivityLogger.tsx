import { useEffect, useContext } from "react";
import { messageAPM, messageCPU } from "../utils/messageHelper";
import { appContext } from "../AppContext";

export const ActivityLogger = () => {
  const { activityData, activityList, setActivityList } =
    useContext(appContext);

  useEffect(() => {
    if (
      activityData.session_id !== "" &&
      !activityList.some((item) => item.timestamp === activityData.timestamp)
    ) {
      setActivityList((prevData) => [...prevData, activityData]);
    }
  }, [activityData]);

  const messageData = (data, message) => {
    if (message === "Actions") {
      return messageAPM(data);
    }
    if (message === "CPU") {
      return messageCPU(data);
    }
  };

  return (
    <>
      <div>
        <h1>Activity Logger</h1>
        {/* Render the activity data */}
        <div className="h-[500px] overflow-y-scroll">
          <ul>
            {[...activityList].reverse().map((data, index) => (
              <li key={index}>
                {data.timestamp} ({`Actions: `}
                {messageData(data.message, "Actions")}, {`CPU Usage: `}
                {messageData(data.message, "CPU")}
                {data["CPU Usage"]})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
