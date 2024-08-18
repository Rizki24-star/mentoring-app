import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import user from "@/lib/user";
import { baseUrl } from "@/lib/values";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Province = {
  id: string;
  name: string;
};

type District = {
  id: string;
  name: string;
};

const fetchProvinces = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/regions/provinces`);
    return await res.json();
  } catch (error) {
    console.log("Error fetching province: " + error);
    return [];
  }
};

const fetchDistricts = async (provinceId: string) => {
  try {
    const res = await fetch(`${baseUrl}/api/regions/provinces/${provinceId}`);
    return await res.json();
  } catch (error) {
    console.log("Error fetching districts: " + error);
    return [];
  }
};

const formatRequestData = async (request: any, provinces: Province[]) => {
  let provinceName: Province = { id: "", name: "Unknown" };
  let districtName: District = { id: "", name: "Unknown" };

  if (request.isOnline === false) {
    const districts = await fetchDistricts(request.provinceId);
    provinceName = provinces.find(
      (province) => province.id == request.provinceId
    )!;
    districtName = (districts as District[]).find(
      (district) => district.id == request.districtId
    )!;
  }

  const tags = (request.RequestTags as any[]).map((tag) => {
    return { id: tag.tags.id, name: tag.tags.name };
  });

  return {
    id: request.id,
    provinceId: request.provinceId,
    districtId: request.districtId,
    location:
      request.isOnline === true
        ? "ONLINE"
        : `${districtName.name}, ${provinceName.name}`,
    title: request.title,
    description: request.description,
    dateTime: request.dateTime,
    tags: tags,
    reward: request.reward,
    additionalInformation: request.additionalInformation,
    specialRequest: request.specialRequest,
    isOnline: request.isOnline,
    status: request.status,
    createdAt: request.createdAt,
    user: {
      id: request.user.id,
      name: request.user.name,
      image: request.user.image,
      email: request.user.email,
    },
  };
};

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const id = Number(url.pathname.split("/").pop());
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized" + session, { status: 401 });
    }

    const userId = (await user(session.user.email!))!.id;

    const request = await prisma.request.findUnique({
      where: {
        id: id,
      },
      include: {
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
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });

    const provinces = await fetchProvinces();
    const data = await formatRequestData(request, provinces);

    return NextResponse.json({ success: true, data: data }, { status: 201 });
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Server Error ", { status: 500 });
  }
};
