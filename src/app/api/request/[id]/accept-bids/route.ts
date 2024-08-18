import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const acceptedBid = await prisma.bids.update({
      where: {
        id: data.bidId,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    const rejectedBid = await prisma.bids.updateMany({
      where: {
        requestId: data.requestId,
        NOT: {
          id: data.bidId,
        },
      },
      data: {
        status: "REJECTED",
      },
    });
  } catch (e) {}
};
