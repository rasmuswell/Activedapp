import React, { useContext, useState } from "react";
import monitorImg from "../assets/monitor.jpg";
import { appContext } from "../AppContext";
import StatsChart from "../Components/StatsChart";
import { splitDate } from "../utils/helpers";

export const Monitor = () => {
  const {
    sessionStatus,
    // setSessionStatus,
    // sessionId,
    // setSessionId,
    // dataStatus,
    // setDataStatus,
    // setActivityData,
    activityList,
    // setActivityList,
    // showSummary,
    // setShowSummary,
    // pendingUid,
    // setPendingUid,
    // timeConnected,
    // blockChainStatus,
    // setBlockChainStatus,
  } = useContext(appContext);

  console.log(activityList);

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center text-white">
      {/* BACKGROUND */}
      <div
        className="relative flex flex-col items-center w-full h-[80vh] bg-cover"
        style={{ backgroundImage: `url(${monitorImg})` }}
      >
        {/* CENTERED CONTENT */}
        {/* BUTTON */}
        {!sessionStatus && (
          <div className="flex w-full h-full justify-center items-center">
            <button className="relative z-20 text-[50px] border-[5px] py-2 px-6 bg-black/80 rounded-[20px] cursor-default">
              No active session
            </button>
          </div>
        )}
        {/* BACKGROUND OVERLAY */}
        {sessionStatus && (
          <div className="bg-black/50 w-[110vw] min-h-[80vh] fixed z-10 transition-colors"></div>
        )}
        {/* COMPONENTS */}
        {sessionStatus && (
          <div className="flex flex-col z-20 gap-20 my-[30px]">
            <div className="relative w-[80vw]">
              <StatsChart data={activityList} />
            </div>
            {/* Render the activity data */}
            <div className="flex flex-col  w-[80vw]">
              {/* <h1 className="text-[30px]">Activity Logger</h1> */}
              <div className="flex overflow-y-hidden w-full ">
                <table className="flex flex-col w-full ">
                  <thead>
                    <tr className="flex gap-5 w-full no-wrap whitespace-nowrap text-center">
                      <th className="w-1/5 ">Date</th>
                      <th className="w-1/5 ">Time (UTC)</th>
                      <th className="w-1/5 ">CPU usage:</th>
                      <th className="w-1/5 ">Memory usage:</th>
                      <th className="w-1/5 ">Actions:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...activityList]
                      .slice(-10)
                      .reverse()
                      .map((data, index) => (
                        <tr
                          key={index}
                          className="flex gap-5 w-full no-wrap text-center"
                        >
                          <td className="w-1/5 ">
                            {splitDate("date", data.timestamp)}
                          </td>
                          <td className="w-1/5">
                            {splitDate("time", data.timestamp)}
                          </td>
                          <td className="w-1/5">{data.cpuUsage}</td>
                          <td className="w-1/5">
                            {data.memoryUsage.toFixed(0)}
                          </td>
                          <td className="w-1/5">{data.actions.toFixed(0)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
