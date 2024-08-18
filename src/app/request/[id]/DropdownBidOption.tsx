"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CiMenuKebab } from "react-icons/ci";
import { CgClose } from "react-icons/cg";
import { BiSolidStar } from "react-icons/bi";

type BidModalProps = {
  userId: string;
  name: string;
  image: string;
  rating: string;
  message: string;
};

const DropdownBidOption = ({ bidDetail }: { bidDetail: BidModalProps }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);
  const [open, setOpen] = useState(false);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => {
          setNotifying(false);
          setDropdownOpen(!dropdownOpen);
        }}
        href="#"
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
      >
        <CiMenuKebab />
      </Link>

      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute -right-27 mt-2.5 flex  w-max flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0  ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <div className="px-4.5 py-3">
          <a
            href="#"
            onClick={() => setOpen(true)}
            className="text-sm font-medium text-bodydark2"
          >
            See detail
          </a>
        </div>
      </div>
      <BidModal
        bidRequestModal={bidDetail}
        open={open}
        onClick={() => setOpen(false)}
      />
    </div>
  );
};

const BidModal = ({
  open,
  onClick,
  bidRequestModal,
}: {
  open: boolean;
  onClick: () => void;
  bidRequestModal: BidModalProps;
}) => {
  const { userId, name, image, rating, message } = bidRequestModal;

  if (open == false) return null;

  return (
    <div
      className={`z-999999 p-4 inset-0 bg-black bg-opacity-40 fixed w-full h-full flex items-start justify-center `}
    >
      <div className="bg-white mx-4 max-w-[620px]  items-center top-1/3 relative p-4 rounded-md">
        <button
          onClick={onClick}
          className="bg-red p-2 absolute right-0 -mt-8 rounded-md mr-4"
        >
          <CgClose className="font-bold text-white" />
        </button>
        <div className="flex items-center gap-x-2 mb-4">
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
          <div className="ms-auto text-primary font-semibold">
            <a href="/profile">Kunjungi profile</a>
          </div>
        </div>
        <p>{message}</p>
        <div className="mt-4 flex items-center gap-4">
          <p className="italic">Apkah anda ingin menerima penawaran?</p>
          <div className="ms-auto flex gap-x-2">
            <a
              href="/payment"
              className="bg-primary text-white px-4 py-2 rounded-md"
            >
              Accept
            </a>
            <a href="" className="bg-gray text-body px-4 py-2 rounded-md">
              Reject
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownBidOption;
