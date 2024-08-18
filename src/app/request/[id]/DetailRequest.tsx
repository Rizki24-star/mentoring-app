"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CiMoneyBill } from "react-icons/ci";
import { FaGift } from "react-icons/fa";
import { RequestDetail } from "@/types/request";
import { useParams } from "next/navigation";
import { timeAgo } from "@/app/utils/timeAgo";
import { BiInfoCircle } from "react-icons/bi";
import { useSession } from "next-auth/react";
import BidList from "./BidList";
import { RequestBidsProvider } from "@/context/RequestBidsContext";

const DetailCard = () => {
  const { id } = useParams();
  const [request, setRequests] = useState<RequestDetail>();

  const { data: Session } = useSession();
  const user = Session?.user;

  useEffect(() => {
    fetch(`/api/request/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRequests(data.data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="grid grid-cols-3 gap-x-4">
      <div className="bg-white w-full py-4 px-6 col-span-2">
        <div className="flex items-center gap-x-2">
          <div className="flex bg-blue-200 text-primary w-max px-2 py-1 items-center gap-1 my-1">
            <BiInfoCircle />
            <p className=" font-medium text-xs">{request?.status}</p>
          </div>
          {request?.reward ? (
            <div className="flex bg-green-200 w-max px-2 items-center gap-2 my-1">
              <CiMoneyBill />
              <p className="text-success font-medium">Rewarded</p>
            </div>
          ) : null}
          <span className="ms-auto lg:text-sm">
            Posted {timeAgo(new Date(request?.createdAt!))}
          </span>
        </div>
        <h2 className="font-bold text-xl text-justify">{request?.title}</h2>
        {user?.email == request?.user.email ? null : (
          <div className="flex items-center gap-2 py-4 mt-5">
            <Link
              href="/bidding"
              className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Accept
            </Link>
            <Link
              href="https://wa.link/8zxsye"
              className="inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Negotiate
            </Link>
            {/* <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Button
            </Link> */}
          </div>
        )}

        <hr />
        <div className="my-4">
          <p className="text-lg ">Location</p>
          <span className="font-semibold">{request?.location}</span>
        </div>

        {request?.reward ? (
          <div className="mb-4">
            <div className="flex items-center gap-x-1">
              <FaGift className="text-primary" />
              <p className="text-lg ">Reward</p>
            </div>
            <span className="font-bold">IDR {request.reward}</span>
          </div>
        ) : null}
        <hr />
        <div className="py-4">
          <p className="text-lg ">Description</p>
          <div>
            <p className="font-bold">{request?.description ?? "-"}</p>
          </div>
        </div>
        <div className="py-4">
          <p className="text-lg ">Special Request</p>
          {request?.specialRequest ?? "-"}
        </div>
        <div className="py-4">
          <p className="text-lg ">Addtional Information</p>
          <p className="italic text-sm">{request?.additionalInformation}</p>
        </div>
        <div className="flex items-center gap-1 mt-4 mb-4">
          {request?.tags.map((tag) => (
            <div className="text-[10px] px-2  font-semibold bg-primary text-white rounded-full">
              @{tag.name}
            </div>
          ))}
        </div>
      </div>
      <RequestBidsProvider requestId={Number(id)}>
        <BidList />
      </RequestBidsProvider>
    </div>
  );
};

export default DetailCard;
