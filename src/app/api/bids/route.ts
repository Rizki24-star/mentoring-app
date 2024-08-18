import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import user from "@/lib/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized" + session, {
        status: 401,
      });
    }

    const userId = (await user(session.user.email!))!.id;

    const bid = await prisma.bids.findMany({
      where: {
        userId: userId,
      },
      include: {
        request: {
          select: {
            title: true,
            reward: true,
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
          },
        },
      },
    });

    const formattedResponse = bid.map((data) => {
      const tags = data.request?.RequestTags.map((tag) => ({
        ...tag.tags,
      }));
      return {
        ...data,
        request: {
          title: data.request?.title,
          reward: data.request?.reward,
          tags: tags,
        },
      };
    });

    return NextResponse.json(
      { success: true, data: formattedResponse },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Server Error ", {
      status: 500,
    });
  }
};
