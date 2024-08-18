"use client";
import { timeAgo } from "@/app/utils/timeAgo";
import { RequestDetail } from "@/types/request";
import React, { useEffect, useState } from "react";
import { BiMoney } from "react-icons/bi";
import { CiLocationOn, CiMoneyBill } from "react-icons/ci";
import { FaGift } from "react-icons/fa";
import BiddingModal from "./BiddingModal";
import { BidsProvider } from "@/context/BidContext";
import { useRequestContext } from "@/context/RequestContext";
import Image from "next/image";

const Home: React.FC = () => {
  const { state } = useRequestContext();
  const [selectedRequest, setSelectedRequest] = useState<RequestDetail | null>(
    null
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedRequest(() => state.request[0]);
    console.log({ first: state.request[0] });
  }, [state]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5">
        <div className="overflow-y-scroll item-center h-screen pr-4">
          {state.isLoading ? (
            <div>Loading...</div>
          ) : state.request.length > 0 ? (
            state.request.map((item) => (
              <RequestCard
                key={item.id}
                id={item.id}
                name={item.user.name}
                image={item.user.image}
                title={item.title}
                location={item.location}
                reward={Number(item.reward)}
                tags={item.tags}
                createdAt={item.createdAt.toString()}
                onClick={() => {
                  setSelectedRequest(() => item);
                  console.log(selectedRequest);
                }}
              />
            ))
          ) : (
            <div className="text-lg font-bold  flex flex-col justify-center items-center">
              <Image
                src="/images/empty/ic_empty.png"
                width={100}
                height={100}
                alt="empty-image"
              />
              No request available yet
            </div>
          )}
        </div>
        <div className="bg-white w-full py-4 px-6 overflow-y-scroll h-screen">
          {selectedRequest == null ? (
            <div className="text-lg font-bold">No request selected</div>
          ) : (
            <div>
              <div className="flex items-center">
                {selectedRequest?.reward ? (
                  <div className="flex bg-green-200 w-max px-2 items-center gap-2 my-1">
                    <CiMoneyBill />
                    <p className="text-success font-medium">Rewarded</p>
                  </div>
                ) : null}
                <span className="ms-auto lg:text-sm">
                  Posted {timeAgo(new Date(selectedRequest?.createdAt))}
                </span>
              </div>
              <div>
                <h2 className="font-bold text-xl text-justify">
                  {selectedRequest!?.title}
                </h2>
                <div className="flex flex-row items-center gap-x-2 my-2">
                  <img
                    className="object-contain rounded-full"
                    src={selectedRequest?.user.image}
                    alt="mentee-profile"
                    style={{ width: "20px", height: "20px" }}
                  />
                  <span className="lg:text-sm">
                    {selectedRequest?.user.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 py-4">
                <a
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 cursor-pointer"
                >
                  Accept
                </a>
                <a
                  href="https://wa.link/8zxsye"
                  className="inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                  Negotiate
                </a>
              </div>
              <hr />
              <div className="mt-2 mb-2">
                <p className="text-lg ">Location</p>
                <span className="font-semibold">
                  {selectedRequest?.location}
                </span>
              </div>
              {selectedRequest?.reward ? (
                <div className="mb-2">
                  <div className="flex items-center gap-x-1">
                    <FaGift className="text-primary" />
                    <p className="text-lg ">Reward</p>
                  </div>
                  <span className="font-bold">
                    IDR {selectedRequest?.reward}
                  </span>
                </div>
              ) : null}

              <hr />
              <div className="mt-2 mb-4">
                <p className="text-lg ">Description</p>
                <div>
                  <p className="font-bold">{selectedRequest?.description}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-lg ">Special Request</p>
                {selectedRequest?.specialRequest}
              </div>
              <div className="mb-4">
                <p className="text-lg ">Addtional Information</p>
                <p className="italic text-sm">
                  {selectedRequest?.additionalInformation}
                </p>
              </div>
              <div className="flex items-center gap-1 mt-4 mb-4">
                {selectedRequest?.tags.map((tag) => (
                  <div className="text-[10px] px-2  font-semibold bg-primary text-white rounded-full">
                    @{tag.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <BidsProvider>
          <BiddingModal
            requestId={selectedRequest!?.id}
            open={open}
            onClick={() => setOpen(false)}
          />
        </BidsProvider>
      </div>
    </>
  );
};

type RequestCardProps = {
  id: number;
  name: string;
  image: string;
  title: string;
  createdAt: string;
  location: string;
  reward: number;
  tags: { id: number; name: string }[];
  onClick: () => void;
};

const RequestCard = ({
  id,
  name,
  image,
  title,
  createdAt,
  location,
  reward,
  tags,
  onClick,
}: RequestCardProps) => {
  return (
    <div className="w-full bg-white p-4 mb-4 cursor-pointer" onClick={onClick}>
      <div className="flex flex-row items-center gap-x-2 mb-2">
        <img
          className="object-contain rounded-full"
          src={image}
          alt="mentee-profile"
          style={{ width: "20px", height: "20px" }}
        />
        <span className="lg:text-xs">{name}</span>
        <span className="ms-auto lg:text-xs">
          {timeAgo(new Date(createdAt))}
        </span>
      </div>

      <a
        href="#"
        className="text-sm font-semibold text-justify hover:text-primary"
      >
        {title}
      </a>
      <div>
        <div className="flex items-center gap-x-2 my-2 text-bodydark2 font-medium text-xs">
          <CiLocationOn />
          {location}
        </div>
        <div className="flex items-center gap-x-2 my-2 text-primary font-semibold text-xs">
          <BiMoney />
          IDR {reward}
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

export default Home;
