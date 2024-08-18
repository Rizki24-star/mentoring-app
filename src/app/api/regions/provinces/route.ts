import { authOptions } from "@/lib/authOptions";
import { regencyBaseApiUrl } from "@/lib/values";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const provinces = await fetch(`${regencyBaseApiUrl}/provinces.json`);
    console.log({ province: provinces });
    return NextResponse.json(await provinces.json());
  } catch (error) {
    return new NextResponse("Internal Server Error ", { status: 500 });
  }
};
