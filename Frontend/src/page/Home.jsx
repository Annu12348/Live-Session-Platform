import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { AiOutlineSound } from "react-icons/ai";
import { MdOutlineCloseFullscreen } from "react-icons/md";
import { Link } from "react-router-dom";

const Home = () => {
  const [ input, setInput ] = useState({
    values: "https://yourapp.com/session/abc123xyz"
  })
  return (
    <div className="w-full h-full  items-center justify-center p-5 flex  ">
      <div className="shadow bg-zinc-50 w-[35%] py-3 pb-5 px-5 flex flex-col items-center justify-center rounded-lg ">
        <h1 className="text-5xl font-bold  capitalize  ">start live session</h1>
        <Link to='/session/abc2345' className="text-md mt-6 uppercase bg-blue-600 cursor-pointer px-4 py-3 font-bold text-white rounded-lg  ">
          start session
        </Link>
        <div className="w-full mt-7 ">
          <label className="leading-none capitalize font-bold text-md ">
            session URL
          </label>
          <div className="flex border border-zinc-100 pr-3 pl-1.5 rounded-lg   ">
            <input
              type="url"
              placeholder="Enter session URL"
              className="border-r-2 outline-none  py-2 border-zinc-100  w-full"
              value={input.values}
            />
            <h1 className=" pl-3 mt-2 uppercase font-semibold ">copy</h1>
          </div>
        </div>
        <div className="w-full bg-black h-[15vh] flex items-end p-4 rounded-lg shadow-lg mt-5">
          <div className="w-full flex items-center justify-between ">
            <span className="text-white ">
              <FaPlay />
            </span>
            <div className="w-[70%] bg-zinc-300 h-1 rounded-lg "></div>
            <span className="text-white text-xl ">
              <AiOutlineSound />
            </span>
            <div className="w-[8%] bg-zinc-700 rounded-lg h-1 "></div>
            <span className="text-white text-xl ">
              <MdOutlineCloseFullscreen />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
//12:00 to 12:30 = 30minat
//4:00 to