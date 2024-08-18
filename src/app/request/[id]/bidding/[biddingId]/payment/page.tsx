import { Metadata } from "next";
import PaymentForm from "./PaymentForm";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tomoro | Detail Request",
};

const Payment = async ({
  params,
}: {
  params: { id: string; biddingId: string };
}) => {
  const getDetailRequest = async () => {
    const request = await prisma.request.findUnique({
      where: {
        id: Number(params.id),
      },
      select: {
        id: true,
        title: true,
        status: true,
        reward: true,
        location: true,
        RequestTags: {
          select: {
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            whatsappNumber: true,
          },
        },
      },
    });

    return {
      id: request?.id!,
      title: request?.title!,
      status: request?.status!,
      reward: request?.reward?.toString()!,
      location: request?.location!,
      tags: request?.RequestTags.map((tag) => ({
        id: tag.tags!.id,
        name: tag.tags!.name,
      }))!,
      user: {
        id: request?.user.id!,
        name: request?.user.name!,
        image: request?.user.image!,
        email: request?.user.email!,
        whatsappNumber: request?.user.whatsappNumber!,
      },
    };
  };

  const detailRequest = await getDetailRequest();
  console.log(detailRequest);

  return (
    <>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <h2 className="text-3xl font-bold text-black mb-6">
          Tomoro | Payment {params.biddingId}
        </h2>
        <PaymentForm
          bidRequestId={params.biddingId}
          requestDetailProps={detailRequest}
        />
      </div>
    </>
  );
};

export default Payment;
