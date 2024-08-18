"use client";
import React, { useEffect, useState } from "react";
import { BiSolidStar } from "react-icons/bi";
import MeetingFormModal from "./MeetingFormModal";
import MeetingCard from "./MeetingCard";
import { useSession } from "next-auth/react";

const MentorCard = ({ email }: { email: string }) => {
  const [open, setOpen] = useState(false);
  const [totalCard, setTotalCard] = useState<number>(0);
  const [meetingCard] = useState<any[]>([]);
  const { data: Session } = useSession();
  const user = Session?.user;

  useEffect(() => {
    meetingCard.push(<MeetingCard />);
    console.log(meetingCard.length);
  }, [meetingCard]);

  return (
    <div className="px-4 py-6 rounded-md bg-blue-50 my-4">
      <h2 className="font-bold text-primary text-2xl text-center">
        Faqihza Mukhlish
      </h2>
      <p className="text-black font-bold my-1 text-center">
        Lecturer at Bandung Institute of Technology
      </p>
      <div className="flex items-center justify-center">
        {" "}
        <BiSolidStar className="text-primary" />
        <p>
          <span className="font-bold">4.5</span> / 5
        </p>
      </div>
      <div className="my-4 bg-white p-4 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <p className="text-black font-medium">Your Review</p>
          <div className="flex items-center  justify-center">
            <BiSolidStar className="text-primary text-lg" />
            <p>
              <span className="font-bold text-lg">4.0</span> / 5
            </p>
          </div>
        </div>
        <p className="">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit,
          aliquid veritatis? Sint nesciunt harum facilis est ipsum hic numquam
          impedit?
        </p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-medium text-xl text-black ">You're meeting</span>
        {user?.email !== email ? null : (
          <a
            onClick={() => setOpen(true)}
            className="text-primary font-semibold cursor-pointer"
          >
            + Add Meeting
          </a>
        )}
      </div>
      {meetingCard.map((item) => item)}
      {user?.email !== email ? null : <MeetingCard />}
      <MeetingFormModal
        open={open}
        onClick={() => setOpen(false)}
        onSubmit={() => setTotalCard(totalCard + 1)}
      />
    </div>
  );
};

export default MentorCard;
