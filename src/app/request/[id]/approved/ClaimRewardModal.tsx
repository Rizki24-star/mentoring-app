"use client";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import SelectGroup from "@/components/form/SelectGroup";
import flatpickr from "flatpickr";
import { useEffect } from "react";
import { CgClose } from "react-icons/cg";

const ClaimRewardModal = ({
  open,
  onClick,
  onSubmit,
}: {
  open: boolean;
  onClick: () => void;
  onSubmit: () => void;
}) => {
  if (open == false) return null;
  // useEffect(() => {}, []);
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
        <h2 className="text-black text-lg font-bold mb-4">Claim Reward</h2>
        <div className="flex flex-col gap-y-4 lg:w-[500px]">
          <SelectGroupOne />
          <input
            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            type="text"
            name="name"
            id="name"
            placeholder="Enter your account name"
          />
          <input
            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            type="text"
            name="bankNumber"
            id="bankNumber"
            placeholder="Enter your bank number"
          />
        </div>
        <div className="mt-4 flex gap-x-2 items-center">
          <div className="ms-auto flex gap-x-2">
            <a
              onClick={() => {
                onSubmit();
                onClick();
              }}
              className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer"
            >
              + Add
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimRewardModal;
