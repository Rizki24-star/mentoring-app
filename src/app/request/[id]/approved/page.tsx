import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { BiSolidStar, BiSolidVideoRecording } from "react-icons/bi";
import DetailCard from "./DetailRequest";
import Image from "next/image";
import { FcRating } from "react-icons/fc";
import { FaMeetup, FaRecordVinyl } from "react-icons/fa";
import { BsCameraVideoFill, BsRecord2Fill, BsRecordFill } from "react-icons/bs";
import MentorCard from "./MentorCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const metadata: Metadata = {
  title: "Tomoro | Detail Request",
};

const getUser = async () => {
  const session = await getServerSession(authOptions);

  return session?.user.email;
};
const DetailRequest = async () => {
  const email = await getUser()!;
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Detail request" />
      <div className="grid grid-cols-3 gap-x-4">
        <DetailCard />

        <div className="py-4 bg-white shadow-sm">
          <h2 className="text-center text-xl ">Your Mentor</h2>
          <Image
            alt="mentor-image"
            src="https://pbs.twimg.com/profile_images/1404991179549151232/_julLg0O_400x400.jpg"
            width={100}
            height={100}
            className="rounded-full mx-auto mt-4"
          />
          <MentorCard email={email!} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DetailRequest;
