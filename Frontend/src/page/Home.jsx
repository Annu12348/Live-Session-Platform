import React from 'react'

const Home = () => {
  return (
    <div className='w-full h-full bg-neutral-200 items-center justify-center flex  '>
      <div className='shadow bg-zinc-300 w-[35%] py-3 pb-5 px-3 flex flex-col items-center justify-center rounded-lg '>
      <h1 className='text-5xl font-black italic capitalize  '>start live session</h1>
      <button className='text-md mt-6 uppercase bg-blue-600 cursor-pointer px-4 py-3 font-bold text-white rounded-lg  '>start session</button>
      <div>
      <label>session URL</label>
      <input
        type="url"
        placeholder="Enter session URL"
        className="border border-gray-400 rounded px-2 py-1 w-full mt-2"
      />
      </div>
      </div>
    </div>
  )
}

export default Home
//12:00 to 3:00
//12:00 to 2:00