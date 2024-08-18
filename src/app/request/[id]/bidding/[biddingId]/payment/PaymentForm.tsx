"use client";
import Image from "next/image";
import { BiInfoCircle, BiMoney } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type RequestPaymentProps = {
  id: number;
  title: string;
  status: string;
  reward: string;
  location: string;
  tags?: { id: number; name: string }[];
  user: {
    id: string;
    name: string;
    image: string;
    email: string;
    whatsappNumber?: string;
  };
};

const PaymentForm = ({
  bidRequestId,
  requestDetailProps,
}: {
  bidRequestId: string;
  requestDetailProps: RequestPaymentProps;
}) => {
  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey!);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const router = useRouter();

  if (!requestDetailProps) return <div>Terjadi Kesalahan</div>;

  const serviceFee = 5000;
  const totalPayment = Number(requestDetailProps.reward) + serviceFee;
  const now = new Date().toISOString();
  const body = {
    request_id: requestDetailProps.id,
    order_id: `order-${requestDetailProps.id}-${now}`,
    gross_amount: totalPayment,
    first_name: requestDetailProps.user.name.split(" ")[0],
    last_name: requestDetailProps.user.name.slice(1),
    email: requestDetailProps.user.email,
    phone: requestDetailProps.user.whatsappNumber,
  };

  const acceptBidRequest = async (bidRequestId: string) => {
    fetch(`/api/payment`, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        (window as any).snap.pay(data.transactionToken, {
          onSuccess: function (result: any) {
            alert("payment success!");
            console.log(result);
          },
          onPending: function (result: any) {
            alert("wating your payment!");
            console.log(result);
          },
          onError: function (result: any) {
            alert("payment failed!");
            console.log(result);
          },
          onClose: function () {
            alert("you closed the popup without finishing the payment");
          },
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-x-12">
        <div>
          <UserCard {...requestDetailProps.user} />
          <h2 className="font-bold text-black text-xl mt-10 mb-4">
            Your product
          </h2>
          <MyRequestCard {...requestDetailProps} />
        </div>
        <div className="bg-white p-8">
          <h2 className="font-bold text-black text-2xl">Order Summary</h2>

          <div className="my-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="kupon"
            >
              Coupon Code
            </label>
            <div className="flex items-center gap-x-4 mb-4">
              <input
                className="w-full text-xl space-x-2 rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="kupon"
                id="kupon"
                placeholder="ENTER COUPON IF ANY"
              />
              <button
                className="bg-black p-4 font-medium rounded-md text-white"
                type="button"
              >
                CHECK
              </button>
            </div>
            <div className="flex items-center my-2">
              <p>Total</p>
              <p className="font-medium ms-auto">
                IDR {requestDetailProps.reward}
              </p>
            </div>
            <div className="flex items-center my-2">
              <p>Service fee</p>
              <p className="font-medium ms-auto">IDR {serviceFee}</p>
            </div>
            <div className="flex items-center my-4 text-xl">
              <p className="font-medium text-black">Order Total</p>
              <p className="font-bold ms-auto text-primary">
                IDR {totalPayment}
              </p>
            </div>

            {/* <span className="my-1 text-red text-xs font-medium">
            {errors.kupon}
          </span> */}
          </div>
          <a
            onClick={() => acceptBidRequest(bidRequestId)}
            className="bg-black w-full py-4 block text-white font-bold text-xl mt-4 rounded-md text-center cursor-pointer"
          >
            PAY ( {totalPayment} )
          </a>
        </div>
      </div>
    </>
  );
};

const MyRequestCard = ({
  title,
  status,
  reward,
  location,
  tags,
}: {
  title: string;
  status: string;
  reward: string;
  location: string;
  tags?: { id: number; name: string }[];
}) => {
  return (
    <div className="bg-white p-4">
      <div className="flex flex-row items-center gap-x-1 ">
        <div className="flex bg-blue-200 text-primary w-max px-2 py-1 items-center gap-1 my-1">
          <BiInfoCircle />
          <p className=" font-medium text-xs">{status}</p>
        </div>
      </div>
      <a href={`/request/1`} className="font-bold hover:text-primary">
        {title}
      </a>
      <div className="flex flex-row items-center gap-2">
        <div className="flex items-center gap-x-1 my-2 text-primary font-semibold text-xs">
          <BiMoney />
          IDR {reward}
        </div>
        <div className="flex items-center gap-x-1 my-2 text-bodydark2 font-medium text-xs">
          <CiLocationOn />
          {location}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-4">
        {!tags ? (
          <div></div>
        ) : (
          tags.map((tag) => (
            <div className="text-[10px] px-2  font-semibold bg-primary text-white rounded-full">
              @Typescript
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const UserCard = ({
  name,
  image,
  email,
}: {
  name: string;
  image: string;
  email: string;
}) => {
  return (
    <div
      className="rounded-lg
          bg-white shadow-default p-6"
    >
      <div className="flex items-center gap-x-2 text-lg text-black font-bold">
        <BiInfoCircle className="text-primary" />
        <h2>User Informarion</h2>
      </div>
      <div className="flex items-center gap-x-4 my-4">
        <Image
          className="rounded-full"
          src={image}
          alt="user-image"
          width={55}
          height={55}
        />
        <div>
          <h2 className="text-primary text-lg  font-semibold">{name}</h2>
          <p>{email}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
