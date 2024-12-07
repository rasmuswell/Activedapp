import { useContext, useState } from "react";
import { ActivityLogger } from "../Components/ActivityLogger";
import recordImg from "../assets/record.jpg";
import { appContext } from "../AppContext";
import { Termsofservice } from "../Components/Termsofservice";
import { Status } from "../Components/Status";
import { IconCopy } from "@tabler/icons-react";
import { copyToClipboard } from "../utils/clipboard";
import { generateSessionId } from "../utils/uuid";
import { TerminateRecording } from "../Components/TerminateRecording";
import { activityBase } from "../utils/objects";
import { nodejsWebsocket } from "../utils/websocket";

export const Record = () => {
  const {
    sessionStatus,
    setSessionStatus,
    sessionId,
    setSessionId,
    dataStatus,
    setDataStatus,
    setActivityData,
    setActivityList,
    showSummary,
    setShowSummary,
    pendingUid,
    setPendingUid,
  } = useContext(appContext);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [popupEnd, setPopupEnd] = useState(false);
  const [effect, setEffect] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleButtonClick = () => {
    setEffect(false);
    setShowTerms(true);
    setShouldAnimate(true); // Trigger overlay animation
  };

  const handleAcceptToS = async (e) => {
    e.preventDefault();
    setShowTerms(false);
    setSessionStatus(true);
    const transformedId = await generateSessionId();
    setSessionId(transformedId);
    nodejsWebsocket("start", transformedId, setDataStatus, setActivityData);
  };

  const handleDenyToS = (e) => {
    e.preventDefault();
    setShowTerms(false);
    setShouldAnimate(false); // Trigger overaly animation
  };

  const handleConfirmTerminate = (e) => {
    e.preventDefault();
    setShowSummary(true);
    setPopupEnd(false);
    nodejsWebsocket(
      "stop",
      sessionId,
      setDataStatus,
      setActivityData,
      setPendingUid
    );
  };

  const handleReturnTerminate = (e) => {
    e.preventDefault();
    setPopupEnd(false);
  };

  const exitSummary = (e) => {
    e.preventDefault();
    setShowSummary(false);
    setSessionStatus(false);
    setActivityData(activityBase);
    setSessionId("");
    setDataStatus("");
    setActivityList([]);
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center text-white">
      {/* BACKGROUND */}
      <div
        className="relative flex flex-col justify-center items-center w-full h-[80vh] bg-cover"
        style={{ backgroundImage: `url(${recordImg})` }}
      >
        {/* BUTTON */}
        {!sessionStatus && !showTerms && (
          <button
            onMouseEnter={() => setEffect(true)} // Trigger effect on hover
            onMouseLeave={() => setEffect(false)} // Reset effect when hover ends
            onClick={handleButtonClick}
            className={`flex items-center justify-center relative z-20 text-[50px] border-[0px] py-2 px-6 bg-black/80 rounded-[20px] hover:border-[0px] transition duration-300 ease-in-out ${
              effect && "animate-wiggle"
            }`}
          >
            <div className="absolute z-20 h-full w-full overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 ease-in-out hover:opacity-70 hover:shadow-lg dark:hover:shadow-black/30 rounded-[15px] "></div>
            <span className="translate-y-[-3px] z-10">Start session</span>
          </button>
        )}
        {/* ToS */}
        {!sessionStatus && showTerms && (
          <div className="relative z-20 p-[20px] max-w-[80vw] bg-black/80 rounded-[10px]">
            <Termsofservice />
            <div className="flex mt-[20px] gap-[10%] justify-center">
              <button
                onClick={handleAcceptToS}
                className={`border-[1px] border-[transparent] border-b-[white] p-2 transition duration-200 ease-in-out hover:border-[1px] hover:border-[white]  rounded-[2px] hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}
              >
                Accept
              </button>
              <button
                onClick={handleDenyToS}
                className={`border-[1px] border-[transparent] border-b-[white] p-2 transition duration-200 ease-in-out hover:border-[1px] hover:border-[white]  rounded-[2px] hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}
              >
                Return
              </button>
            </div>
          </div>
        )}
        {/* Confirm Terminate Recording  */}
        {popupEnd && (
          <div className="relative z-20 p-[20px] max-w-[80vw] bg-black/80 rounded-[10px]">
            <TerminateRecording dataStatus={dataStatus} />
            <div className="flex mt-[20px] gap-[10%] justify-center">
              <button
                onClick={handleConfirmTerminate}
                className={`border-[1px] border-[transparent] border-b-[white] p-2 transition duration-200 ease-in-out hover:border-[1px] hover:border-[white]  rounded-[2px] hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}
              >
                Confirm
              </button>
              <button
                onClick={handleReturnTerminate}
                className={`border-[1px] border-[transparent] border-b-[white] p-2 transition duration-200 ease-in-out hover:border-[1px] hover:border-[white]  rounded-[2px] hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}
              >
                Return
              </button>
            </div>
          </div>
        )}
        {/* OVERLAY */}
        {(sessionStatus || showTerms) && (
          <div
            className={`bg-black/50 w-full h-[80vh] absolute z-10 transition-colors duration-1000 ${
              shouldAnimate ? "animate-fadeIn" : ""
            }`}
            onAnimationEnd={() => setShouldAnimate(false)} // Reset animation state after it ends
          ></div>
        )}
        {/* COMPONENTS */}
        {sessionStatus && !popupEnd && (
          <>
            <h2
              title="Click to copy"
              className="text-[white] z-20 m-4 flex bg-[white]/10 text-[1.25rem] items-center gap-1 border-[1px] border-[transparent] hover:border-[1px] hover:border-[white] hover:cursor-pointer transition-colors duration-300 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 active:text-[black] focus:text-[black] p-[10px]"
              onClick={(event) => {
                copyToClipboard(sessionId);

                const target = event.currentTarget as HTMLElement;
                target.focus();
                setTimeout(() => target.blur(), 500); // Remove focus after 500ms
              }} // Correctly invoke the `copy` function with `sessionId`
            >
              Session ID: {sessionId} <IconCopy className="p-[2px]" />
            </h2>
            <section className="flex flex-col z-20 items-start w-full h-full p-4 gap-10">
              <div className="flex relative w-full justify-around">
                <Status set={"Data"} msg={dataStatus} />

                <Status set={"Blockchain"} msg={"Not implemented yet"} />
              </div>

              <div className="relative w-full">
                <ActivityLogger />
              </div>
            </section>
            {!showSummary ? (
              <div className="flex w-full justify-end p-4">
                <button
                  onClick={() => setPopupEnd(true)}
                  className="z-20 p-2 border-[1px] bg-[red]/20 hover:bg-[red]/80"
                >
                  End session
                </button>
              </div>
            ) : (
              <div className="flex w-full justify-end p-4">
                <button
                  onClick={exitSummary}
                  className="z-20 p-2 border-[1px] bg-[red]/20 hover:bg-[red]/80"
                >
                  Exit summary
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};
