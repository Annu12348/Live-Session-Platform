import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-5 flex-col ">
      <h1 className="text-7xl font-bold">404</h1>
      <h1 className="text-3xl capitalize font-bold mt-2  ">page not found</h1>
      <p className="text-md  tracking-tight my-4">We're sorry, but the page you requested could not be found.</p>
      <Link to='/' className="text-white bg-black w-fit px-5 py-4 mt-2 leading-none rounded font-semibold">Back to Home</Link>
    </div>
  );
};

export default NotFound;
