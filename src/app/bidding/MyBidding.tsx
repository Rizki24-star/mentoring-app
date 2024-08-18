"use client";

import { useEffect, useState } from "react";
import { BiInfoCircle, BiMoney } from "react-icons/bi";
import { CiLocationOn, CiMenuKebab, CiMoneyBill } from "react-icons/ci";
import { BsCameraVideoFill } from "react-icons/bs";
import { BidsProvider, useBidContext } from "@/context/BidContext";
import { BiddingRequest } from "@/types/biddind";

const MyBidding = () => {
  const { state, dispatch } = useBidContext();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  console.log({ bidds: state });

  return (
    <div className="grid grid-cols-4 gap-x-4">
      <div className="col-span-3">
        {state.isLoading === true ? (
          <div>Loading...</div>
        ) : (
          state.bids.map((bid) => (
            <BiddingCard
              message={bid.message}
              status={bid.status}
              biddingRequest={bid.request}
            />
          ))
        )}
      </div>
      <div className="col-span-1">
        <div className="bg-white p-4">
          <p className="font-medium text-black">Your schedule</p>
          <div className="py-2">
            <span className="text-primary font-medium">Today</span>
            <div className="py-1">
              <div className="flex items-center justify-between">
                <span>Meeting Online</span>
                <span className="font-bold">13:58 WIB</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <a href="#" className="text-primary">
                  See
                </a>
                <button className="bg-primary text-white flex items-center py-1 px-2 gap-x-1 shadow-sm">
                  <BsCameraVideoFill />
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="py-2">
            <span className="text-primary font-medium">Today</span>
            <div className="py-1">
              <div className="flex items-center justify-between">
                <span>Meeting Online</span>
                <span className="font-bold">08:00 WIB</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <a href="#" className="text-primary">
                  See
                </a>
                <button className="bg-primary text-white flex items-center py-1 px-2 gap-x-1 shadow-sm">
                  <BsCameraVideoFill />
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="py-2">
            <span className="text-primary font-medium">Tomorrow</span>
            <div className="py-1">
              <div className="flex items-center justify-between">
                <span>On-site mentoring</span>
                <span className="font-bold">15:25 WIB</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <a href="#" className="text-primary">
                  See
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BiddingCard = ({
  message,
  status,
  biddingRequest,
}: {
  message: string;
  status: string;
  biddingRequest: any;
}) => {
  let statusStyle = "";
  switch (status) {
    case "REJECTED":
      statusStyle = "text-rose-600 bg-rose-100";
      break;
    case "ACCEPTED":
      statusStyle = "text-green-600 bg-green-100";
      break;
    default:
      statusStyle = "text-blue-600 bg-blue-100";
      break;
  }
  return (
    <div className="bg-white p-4  mb-4">
      <div className="flex flex-row justify-between items-center gap-x-1 ">
        <div
          className={`flex ${statusStyle}  w-max px-2 py-1 items-center gap-1 my-1`}
        >
          <BiInfoCircle />
          <p className=" font-medium text-xs">{status}</p>
        </div>
        <div className="flex gap-x-4 items-center">
          <span className="p-1 text-body rounded-md text-xs font-medium">
            2h ago
          </span>
          <CiMenuKebab />
        </div>
      </div>
      <p className="text-medium text-black mt-2">{message}</p>

      <div className=" mt-4 p-4 bg-blue-100 rounded-md">
        <p className="font-medium text-primary">Request</p>
        <div className="my-2 ">
          <BiddingRequestCard {...biddingRequest} />
        </div>
      </div>
    </div>
  );
};

const BiddingRequestCard = ({
  status,
  title,
  reward,
  location,
  tags,
}: BiddingRequest) => {
  return (
    <div className="bg-white p-4">
      {/* <div className="flex flex-row items-center gap-x-1 ">
        <div className="flex bg-blue-200 text-primary w-max px-2 py-1 items-center gap-1 my-1">
          <BiInfoCircle />
          <p className=" font-medium text-xs">NEW</p>
        </div>
        <div className="flex bg-green-200 text-success w-max px-2 py-1 items-center gap-1 my-1">
          <CiMoneyBill />
          <p className=" font-medium text-xs">Rewarded</p>
        </div>
      </div> */}
      <a
        href={`/request/${status === "ACCEPTED" ? "5" : "4"}/approved`}
        className="font-bold hover:text-primary"
      >
        {title}
      </a>
      <div className="flex flex-row items-center gap-2">
        <div className="flex items-center gap-x-1 my-2 text-primary font-semibold text-xs">
          <BiMoney />
          IDR {reward}
        </div>
        <div className="flex items-center gap-x-1 my-2 text-bodydark2 font-medium text-xs">
          <CiLocationOn />
          {location}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-4">
        {tags &&
          tags.map((tag) => (
            <div className="text-[10px] px-2  font-semibold bg-primary text-white rounded-full">
              {tag.name}
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyBidding;
