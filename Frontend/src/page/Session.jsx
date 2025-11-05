import React from "react";
import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

const Session = () => {
  return (
    <div className="w-full h-full flex items-center p-5 justify-center ">
      <div className="p-3 bg-white w-[50vh] shadow rounded-lg flex flex-col items-center justify-center ">
        <h1 className="text-3xl leading-none tracking-tight font-bold capitalize">
          join live session
        </h1>
        <div className="w-full h-[25vh] mt-2 bg-black rounded-t-xl flex items-center justify-center  ">
          <span className="text-white text-3xl  ">
            <FaPlay />
          </span>
        </div>
        <div className="w-full ">
          <h3 className="mt-2 font-bold text-xl tracking-tight">
            Session Id : abcd123xyz
          </h3>
          <p className="text-md text-sm font-semibold tracking-tight leading-none mt-1 mb-1.5 ">
            You have joined the session.
          </p>
        </div>
        <Link
          to="/"
          className="bg-zinc-200 w-full text-center mt-3 py-4 rounded uppercase font-semibold tracking-tight leading-none  "
        >
          leave session
        </Link>
      </div>
    </div>
  );
};

export default Session;
