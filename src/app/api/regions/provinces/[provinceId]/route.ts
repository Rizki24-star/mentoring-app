import { regencyBaseApiUrl } from "@/lib/values";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const provinceId = url.pathname.split("/").pop();
  try {
    // const session = await getServerSession(authOptions);
    // console.log(session);
    // if (!session) {
    //   return new NextResponse("Unauthorized" + session, { status: 401 });
    // }

    const districts = await fetch(
      `${regencyBaseApiUrl}/regencies/${provinceId}.json`
    );
    console.log({ district: districts });
    return NextResponse.json(await districts.json());
  } catch (error) {
    console.log(error);
    return new NextResponse(
      `Internal Server Error ${regencyBaseApiUrl}/regencies/${provinceId}.json`,
      { status: 500 }
    );
  }
};
