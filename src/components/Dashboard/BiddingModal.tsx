"use client";
import { useBidContext } from "@/context/BidContext";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CgClose } from "react-icons/cg";

type BidModalProps = {
  requestId: number;
  open: boolean;
  onClick: () => void;
};

const BiddingModal = ({ requestId, open, onClick }: BidModalProps) => {
  const { state, createBid } = useBidContext();

  const [newBid, setNewBid] = useState(() => ({
    requestId: requestId,
    message: "",
  }));
  const router = useRouter();

  if (open == false) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const data = event.target as any;

    console.log(newBid);

    try {
      createBid(newBid);

      router.push("/bidding");
    } catch (error) {
      console.log({ create_bid_error: error });
    }
  };

  return (
    <div
      className={`z-999999 p-4 inset-0 bg-black bg-opacity-40 fixed w-full h-full flex items-start justify-center `}
    >
      <div className="bg-white mx-4 max-w-[820px]  items-center top-1/3 relative p-4 rounded-md">
        <button
          onClick={onClick}
          className="bg-red p-2 absolute right-0 -mt-8 rounded-md mr-4"
        >
          <CgClose className="font-bold text-white" />
        </button>
        <h2 className="text-black text-lg font-bold mb-4">Bid Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-4 lg:w-[500px]">
            <label>Please write your offer message to the requester</label>
            <textarea
              className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              name="message"
              id="message"
              placeholder="Enter your message"
              value={newBid.message}
              onChange={(e) =>
                setNewBid((prev) => ({
                  requestId: requestId,
                  message: e.target.value,
                }))
              }
            />
          </div>
          <div className="mt-4 flex gap-x-2 items-center">
            <div className="ms-auto flex gap-x-2">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer"
              >
                {state.isLoading === true ? "Loading..." : "Send"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BiddingModal;
