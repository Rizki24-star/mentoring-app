import React from "react";
import { BsCameraVideoFill } from "react-icons/bs";

const MeetingCard = () => {
  return (
    <div className="grid grid-cols-3 gap-x-6 mt-4 ">
      <div className="col-span-2 rounded-md  bg-white p-4 shadow-2 shadow-gray">
        <p className=" text-black font-semibold">21 June (Friday)</p>
        <span>12.090 PM - 13.30 PM</span>
      </div>
      <div className="flex flex-col items-center justify-center rounded-md bg-white text-primary p-2 text-center cursor-pointer py-2 shadow-2 shadow-gray">
        <BsCameraVideoFill className="text-xl" />
        <p className="font-bold mt-1">Start</p>
      </div>
    </div>
  );
};

export default MeetingCard;
