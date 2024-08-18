"use client";

import React from "react";
import DropdownBidOption from "./DropdownBidOption";
import { BiSolidStar } from "react-icons/bi";
import { useRequestBidsContext } from "@/context/RequestBidsContext";

const BidList = () => {
  const { state } = useRequestBidsContext();
  const { data, isLoading } = state;

  return (
    <div className="p-4 bg-white ">
      <h2 className="font-medium">Bids ({data.length})</h2>

      {isLoading ? (
        <div>Loading</div>
      ) : (
        data.map((bid) => (
          <BidCard
            id={bid.id}
            message={bid.message}
            name={bid.user.name}
            rating={bid.user?.user_review?.toString() ?? "-"}
            image={bid.user.image}
            userId={bid.user.id}
            requestId={bid.requestId}
          ></BidCard>
        ))
      )}
    </div>
  );
};

const BidCard = ({
  id,
  message,
  name,
  rating,
  image,
  userId,
  requestId,
}: {
  id: number;
  message: string;
  name: string;
  rating: string;
  image: string;
  userId: string;
  requestId: number;
}) => {
  return (
    <div className="mb-4">
      <div className="flex flex-col gap-y-2 my-4">
        <div className="flex items-center gap-x-2">
          <img
            className="object-contain rounded-full "
            src={image}
            alt="mentee-profile"
            style={{ width: "34px", height: "34px" }}
          />
          <div>
            <h2 className="font-medium">{name}</h2>
            <div className="flex items-center gap-1">
              <BiSolidStar className="text-primary" />
              <p>
                <span className="font-bold">{rating}</span> / 5
              </p>
            </div>
          </div>
        </div>
        <p>{message}</p>

        <div className="flex items-center gap-x-2 mt-2">
          <a
            href={`/request/${requestId}/bidding/${id}/payment`}
            className="bg-primary rounded-sm text-white font-medium px-4 py-1 cursor-pointer"
          >
            Accept
          </a>
          <a className="border-2 border-body  rounded-sm text-border font-medium px-4 py-1">
            Reject
          </a>
          <div className="ms-auto">
            <DropdownBidOption
              bidDetail={{
                name: name,
                image: image,
                message: message,
                rating: rating,
                userId: userId,
              }}
            />
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default BidList;
