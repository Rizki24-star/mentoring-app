"use client";

import { useEffect, useState } from "react";
import { BiInfoCircle, BiMoney } from "react-icons/bi";
import { CiLocationOn, CiMoneyBill } from "react-icons/ci";
import { timeAgo } from "../utils/timeAgo";
import { TMyRequest } from "@/types/request";
import useFetch from "@/hooks/useFetch";

const MyRequest = () => {
  const { data, error, loading } = useFetch<TMyRequest[]>(
    "/api/request/my-request"
  );
  const [requests, setRequests] = useState<TMyRequest[]>([]);
  // const [error, setError] = useState<boolean>(false);

  // useEffect(() => {
  //   fetch("/api/request/my-request")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data.data);
  //       setRequests(data.data);
  //     })
  //     .catch((error) => {
  //       setError(true);
  //       console.log(error);
  //     });
  // }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data found</div>;
  }

  return (
    <div className="flex flex-col gap-y-4">
      {data.map((item) => MyRequestCard(item))}
    </div>
  );
};

const MyRequestCard = ({
  id,
  title,
  location,
  reward,
  tags,
  status,
  createdAt,
  totalBid,
}: TMyRequest) => {
  return (
    <div className="bg-white p-4">
      <div className="flex flex-row items-center gap-x-1 ">
        <div className="flex bg-blue-200 text-primary w-max px-2 py-1 items-center gap-1 my-1">
          <BiInfoCircle />
          <p className=" font-medium text-xs">{status}</p>
        </div>
        {reward ? (
          <div className="flex bg-green-200 text-success w-max px-2 py-1 items-center gap-1 my-1">
            <CiMoneyBill />
            <p className=" font-medium text-xs">Rewarded</p>
          </div>
        ) : null}
        <span className="p-1 text-body rounded-md text-xs">
          {totalBid} Biids
        </span>
        <div className="ms-auto">
          <span className="p-1 text-body rounded-md text-xs font-medium">
            {timeAgo(new Date(createdAt))}
          </span>
        </div>
      </div>
      <a href={`/request/${id}`} className="font-bold hover:text-primary">
        {title}
      </a>
      <div className="flex flex-row items-center gap-2">
        {reward ? (
          <div className="flex items-center gap-x-1 my-2 text-primary font-semibold text-xs">
            <BiMoney />
            {reward}
          </div>
        ) : null}
        <div className="flex items-center gap-x-1 my-2 text-bodydark2 font-medium text-xs">
          <CiLocationOn />
          {location}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-4">
        {tags.map((tag) => (
          <div className="text-[10px] px-2  font-semibold bg-primary text-white rounded-full">
            @{tag.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRequest;
