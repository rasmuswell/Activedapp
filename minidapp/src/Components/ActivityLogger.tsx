import { useEffect, useContext } from "react";
import { appContext } from "../AppContext";
import { splitDate } from "../utils/helpers";

export const ActivityLogger = () => {
  const { activityData, activityList, setActivityList } =
    useContext(appContext);

  useEffect(() => {
    if (
      activityData.sessionId !== "" &&
      !activityList.some((item) => item.timestamp === activityData.timestamp)
    ) {
      setActivityList((prevData) => [...prevData, activityData]);
    }
  }, [activityData]);

  return (
    <>
      <div className="w-full">
        <h1>Activity Logger</h1>
        {/* Render the activity data */}
        <div className="flex h-[500px] overflow-y-hidden w-1/2">
          <table className="flex flex-col w-full ">
            <thead>
              <tr className="flex gap-5 w-full no-wrap whitespace-nowrap">
                <th className="w-1/5">Date</th>
                <th className="w-1/5">Time</th>
                <th className="w-1/5">CPU usage:</th>
                <th className="w-1/5">Memory usage:</th>
                <th className="w-1/5">Actions:</th>
              </tr>
            </thead>
            <tbody>
              {[...activityList].reverse().map((data, index) => (
                <tr key={index} className="flex gap-5 w-full no-wrap">
                  <td className="w-1/5">{splitDate("date", data.timestamp)}</td>
                  <td className="w-1/5">{splitDate("time", data.timestamp)}</td>
                  <td className="w-1/5">{data.cpuUsage}</td>
                  <td className="w-1/5">{data.memoryUsage.toFixed(0)}</td>
                  <td className="w-1/5">{data.actions.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
