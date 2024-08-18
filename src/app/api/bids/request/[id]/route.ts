import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import user from "@/lib/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    const url = new URL(req.url);
    const requestId = Number(url.pathname.split("/").pop());

    if (!session) {
      return new NextResponse("Unauthorized" + session, {
        status: 401,
      });
    }

    const userId = (await user(session.user.email!))!.id;

    const bids = await prisma.bids.findMany({
      where: {
        requestId: requestId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            user_review: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    const formattedResponse = bids.map((bid) => {
      let totalRating = 0;
      bid.user?.user_review.map((review) => {
        totalRating += review.rating;
      });
      return {
        ...bid,
        user: {
          ...bid.user,
          user_review: totalRating / bid.user?.user_review.length!,
        },
      };
    });

    return NextResponse.json(
      { success: true, data: formattedResponse },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
