import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import user from "@/lib/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized" + session, {
        status: 401,
      });
    }

    const data = await req.json();
    const userId = (await user(session.user.email!))!.id;

    const bid = await prisma.bids.create({
      data: {
        userId: userId,
        requestId: data.requestId,
        message: data.message,
      },
    });

    return NextResponse.json({ success: true, data: bid }, { status: 201 });
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Server Error ", {
      status: 500,
    });
  }
};
