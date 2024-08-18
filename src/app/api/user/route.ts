import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized" + session, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email!,
      },
      select: {
        name: true,
        image: true,
        whatsappNumber: true,
        about: true,
        UserTags: {
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
    });

    const formattedUser = {
      name: user?.name,
      image: user?.image,
      whatsappNumber: user?.whatsappNumber,
      about: user?.about,
      tags: user?.UserTags.map((tag) => {
        return {
          id: tag.tags?.id,
          name: tag.tags?.name,
        };
      }),
    };

    return NextResponse.json(
      { success: true, data: formattedUser },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Server Error ", { status: 500 });
  }
};
