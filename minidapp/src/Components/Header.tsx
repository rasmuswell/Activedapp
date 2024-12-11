import React, { useContext } from "react";
import { appContext } from "../AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const location = useLocation(); // Get the current route location

  const handleNavigate = (
    url: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    navigate(url);
  };

  const isActive = (path: string) => location.pathname === path; //TODO: White underline for active page / change color

  return (
    <header className="h-[64px] px-4 bg-[black] flex justify-between items-center text-[gray] z-30">
      <div className="flex items-center text-[white]">
        <Link to={`/`} className="flex cursor-pointer gap-[5px]">
          {/* <img src={V_Logo_white} className="w-[32px] h-[32px]"></img> */}
          <h1 className="text-[20px]">ActiveDapp</h1>
        </Link>
      </div>
      <nav className="flex">
        <ul className="flex gap-6">
          {/* HOME */}
          <li className="flex items-center text-[white]">
            <button
              onClick={(e) => handleNavigate("/", e)}
              className={` border-[1px] border-[transparent] p-1 transition duration-300 ease-in-out ${
                isActive("/")
                  ? "text-[gray] border-b-[1px] border-b-[white] "
                  : "hover:border-[1px] hover:border-[white]  rounded-[2px] hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              }`}
            >
              Record
            </button>
          </li>

          {/* HISTORY */}
          <li className="flex items-center text-[white]">
            <button
              onClick={(e) => handleNavigate("/monitor", e)}
              className={` border-[1px] border-[transparent] p-1 transition duration-300 ease-in-out ${
                isActive("/monitor")
                  ? "text-[gray] border-b-[1px] border-b-[white] "
                  : "hover:border-[1px] hover:border-[white]  rounded-[2px] hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              }`}
            >
              Monitor
            </button>
          </li>

          {/* INFO */}
          <li className="flex items-center text-[white]">
            <button
              onClick={(e) => handleNavigate("/review", e)}
              className={` border-[1px] border-[transparent] p-1 transition duration-300 ease-in-out ${
                isActive("/review")
                  ? "text-[gray] border-b-[1px] border-b-[white] "
                  : "hover:border-[1px] hover:border-[white]  rounded-[2px] hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              }`}
            >
              Review
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};
