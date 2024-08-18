import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import user from "@/lib/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";
import { baseUrl } from "@/lib/values";

const getLocation = async (
  provinceId: number,
  districtId: number
): Promise<string> => {
  try {
    const res = await fetch(`${baseUrl}/api/regions/provinces`);
    const provinces = await res.json();
    const selectedProvince = provinces.find(
      (province: { id: number; name: string }) => province.id == provinceId
    );

    const resDistricts = await fetch(
      `${baseUrl}/api/regions/provinces/${provinceId}`
    );
    const districts = await resDistricts.json();
    const selectedDistrict = districts.find(
      (districts: { id: number; name: string }) => districts.id == districtId
    );
    console.log(selectedDistrict);
    return selectedProvince.name + ", " + selectedDistrict.name;
  } catch (error) {
    console.log("Error fetching province: " + error);
    return error as string;
  }
};

// const fetchDistricts = async (
//   provinceId: number,
//   districtId: number
// ): Promise<string> => {
//   try {
//     const res = await fetch(`${baseUrl}/api/regions/provinces/${provinceId}`);
//     const districts = await res.json();
//     const selectedDistrict = districts.map(
//       (districts: { id: number; name: string }) => districts.id == districtId
//     );

//     return selectedDistrict.name;
//   } catch (error) {
//     console.log("Error fetching districts: " + error);
//     return error as string;
//   }
// };

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized" + session, { status: 401 });
    }

    const data = await req.json();

    const userId = (await user(session.user.email!))!.id;
    var location = "ONLINE";
    if (data.provinceId) {
      location = await getLocation(
        Number(data.provinceId),
        Number(data.districtId)
      );
    }

    const request = await prisma.request.create({
      data: {
        userId: userId,
        title: data.title,
        description: data.title,
        dateTime: moment().toISOString(data.dateTime),
        reward:
          !Number(data.reward) || Number(data.reward) < 1
            ? null
            : Number(data.reward),
        specialRequest: data.specialRequest,
        additionalInformation: data.additionalRequest,
        provinceId: Number(data.provinceId),
        districtId: Number(data.districtId),
        location: location,
        isOnline: data.isOnline,
      },
    });

    await Promise.all(
      data.tags.map(
        async (tag: number) =>
          await prisma.requestTags.create({
            data: {
              requestId: request.id,
              tagId: Number(tag),
            },
          })
      )
    );

    return NextResponse.json({ success: true, data: data }, { status: 201 });
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Server Error ", { status: 500 });
  }
};
