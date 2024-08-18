"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CiMoneyBill } from "react-icons/ci";
import { FaGift } from "react-icons/fa";
import { RequestDetail } from "@/types/request";
import { useParams } from "next/navigation";
import { timeAgo } from "@/app/utils/timeAgo";
import moment from "moment";
import { BiCheckCircle, BiInfoCircle } from "react-icons/bi";
import { useSession } from "next-auth/react";
import ClaimRewardModal from "./ClaimRewardModal";

const DetailCard = () => {
  const params = useParams<{ id: string }>();
  const [request, setRequests] = useState<RequestDetail>();
  const { data: Session } = useSession();
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<boolean>(false);

  const user = Session?.user;

  useEffect(() => {
    fetch(`/api/request/${params.id}`)
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
    <div className="bg-white w-full py-4 px-6 col-span-2">
      {alert === true ? (
        <div className="flex w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9 mb-6">
          <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                fill="white"
                stroke="white"
              ></path>
            </svg>
          </div>
          <div className="w-full">
            <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#34D399] ">
              Claim request successfully
            </h5>
            <p className="text-base leading-relaxed text-body">
              Withdrawing rewards may take a maximum of 1 x 24 hours, make sure
              to check your email and account regularly
            </p>
          </div>
        </div>
      ) : null}
      <div className="flex items-center gap-x-2">
        <div
          className={`flex ${request?.status == "DONE" ? "bg-green-200 text-green-700" : "bg-yellow-200 text-yellow-700"} w-max px-2 py-1 items-center gap-1 my-1`}
        >
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
      {user?.email !== request?.user.email ? (
        alert == false && request?.status == "DONE" ? (
          <a
            onClick={() => setOpen(true)}
            className="inline-flex gap-2 items-center justify-center rounded-md bg-primary px-10 py-4  my-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 cursor-pointer"
          >
            <BiCheckCircle />
            Claim Reward
          </a>
        ) : null
      ) : (
        <Link
          href="#"
          className="inline-flex gap-2 items-center justify-center rounded-md bg-primary px-10 py-4  my-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <BiCheckCircle />
          Finish Mentoring
        </Link>
      )}
      <hr />
      <div className="my-4">
        <p className="text-lg ">
          Location {user?.email + "" + request?.user.email}
        </p>
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
      <ClaimRewardModal
        open={open}
        onClick={() => setOpen(false)}
        onSubmit={() => setAlert(true)}
      />
    </div>
  );
};

export default DetailCard;
