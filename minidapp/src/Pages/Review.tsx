import React, { useState } from "react";
import reviewImg from "../assets/review.jpg";

export const Review = () => {
  const [sessionStatus, setSessionStatus] = useState(false);

  const startSession = () => {
    setSessionStatus(true);
  };
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center text-white">
      <div
        className="relative flex justify-center items-center w-full h-[80vh] bg-cover"
        style={{ backgroundImage: `url(${reviewImg})` }}
      >
        {!sessionStatus && (
          <button
            onClick={startSession}
            className="relative z-20 text-[50px] border-[5px] py-2 px-6 bg-black/80 rounded-[20px] hover:bg-transparent hover:text-[red]/80 hover:border-[transparent] transition-all duration-300 delay-50"
          >
            Review session
          </button>
        )}
        {sessionStatus && (
          <div className="bg-black/50 w-full h-[80vh] absolute z-10 transition-colors duration-1000 animate-fadeIn"></div>
        )}
        {sessionStatus && <div className="relative z-20"></div>}
      </div>
    </main>
  );
};
