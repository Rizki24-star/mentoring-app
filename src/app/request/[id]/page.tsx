import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DetailCard from "./DetailRequest";
import { BiSolidStar } from "react-icons/bi";
import DropdownBidOption from "./DropdownBidOption";
import BidList from "./BidList";
import { RequestBidsProvider } from "@/context/RequestBidsContext";

export const metadata: Metadata = {
  title: "Tomoro | Detail Request",
};

const DetailRequest = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Detail request" />
      <DetailCard />
    </DefaultLayout>
  );
};

const BidCard = ({
  message,
  name,
  rating,
}: {
  message: string;
  name: string;
  rating: string;
}) => {
  return (
    <div className="mb-4">
      <div className="flex flex-col gap-y-2 my-4">
        <p>{message}</p>
        <div className="flex items-center gap-x-2">
          <img
            className="object-contain rounded-full "
            src={
              "https://lh3.googleusercontent.com/a/ACg8ocJn8MtPN8K7fMdrnyn7j6ofLpTrHZqWXVAQ_k2CrJTGUxJQKA=s96-c"
            }
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
        <div className="flex items-center gap-x-2 mt-2">
          <a
            href="/payment"
            className="bg-primary rounded-sm text-white font-medium px-4 py-1"
          >
            Accept
          </a>
          <a className="border-2 border-body  rounded-sm text-border font-medium px-4 py-1">
            Reject
          </a>
          <div className="ms-auto">
            <DropdownBidOption />
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default DetailRequest;
