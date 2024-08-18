import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized" + session, { status: 401 });
    }

    const data = await req.json();

    const user = await prisma.user.update({
      where: {
        email: session.user.email!,
      },
      data: {
        whatsappNumber: data.whatsappNumber,
        about: data.about,
      },
    });

    const userTags = await prisma.userTags.createMany({
      data: (data.tags as string[]).map((tag) => {
        return {
          userId: user.id,
          tagId: Number(tag),
        };
      }),
      skipDuplicates: true,
    });

    const response = {
      ...user,
      tags: userTags,
    };

    return NextResponse.json(
      { success: true, data: response },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Server Error ", { status: 500 });
  }
};
