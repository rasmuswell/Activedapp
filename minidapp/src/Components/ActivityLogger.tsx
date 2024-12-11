import { useEffect, useContext, useState } from "react";
import { appContext } from "../AppContext";
import { splitDate } from "../utils/helpers";

export const ActivityLogger = () => {
  const { activityList } = useContext(appContext);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (activityList.length > 0) {
      setIsUpdated(true);
      const timeout = setTimeout(() => setIsUpdated(false), 300); // Animation reset after 1 second
      return () => clearTimeout(timeout);
    }
  }, [activityList]);

  return (
    <>
      <div className="w-full flex flex-col items-center gap-5">
        <h1 className="text-[30px]">Latest recorded data:</h1>
        <div className="flex flex-row gap-2">
          {activityList.length > 0 && (
            <>
              {["Date", "Time (UTC)", "CPU (%)", "Memory (GB)", "Actions"].map(
                (label, index) => {
                  const value = (() => {
                    const lastItem = activityList[activityList.length - 1];
                    switch (label) {
                      case "Date":
                        return splitDate("date", lastItem.timestamp);
                      case "Time (UTC)":
                        return splitDate("time", lastItem.timestamp);
                      case "CPU (%)":
                        return lastItem.cpuUsage;
                      case "Memory (GB)":
                        return lastItem.memoryUsage.toFixed(0);
                      case "Actions":
                        return lastItem.actions;
                      default:
                        return "";
                    }
                  })();

                  return (
                    <div
                      key={label}
                      className={`text-black flex flex-col font-bold z-20 m-4 text-[1.25rem] items-center gap-1 border-[1px] p-[10px] min-w-[100px] text-center
              bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 transition-all duration-100 ease-in-out
              ${isUpdated ? "animate-none border-red-500" : "border-black"}`}
                    >
                      <span>{label}:</span>
                      <span>{value}</span>
                    </div>
                  );
                }
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
