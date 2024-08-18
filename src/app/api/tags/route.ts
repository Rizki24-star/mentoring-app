import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { regencyBaseApiUrl } from "@/lib/values";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized" + session, { status: 401 });
    }

    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    const formattedTags = tags.map((tag) => ({
      value: tag.id.toString(),
      text: tag.name,
      selected: false,
    }));
    return NextResponse.json(formattedTags);
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Server Error ", { status: 500 });
  }
};
