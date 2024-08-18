import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import user from "@/lib/user";
import { baseUrl } from "@/lib/values";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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

const formatRequestData = async (requests: any[], provinces: Province[]) => {
  return Promise.all(
    requests.map(async (item) => {
      let provinceName: Province = { id: "", name: "Unknown" };
      let districtName: District = { id: "", name: "Unknown" };

      if (item.isOnline === false) {
        const districts = await fetchDistricts(item.provinceId);
        provinceName = provinces.find(
          (province) => province.id == item.provinceId
        )!;
        districtName = (districts as District[]).find(
          (district) => district.id == item.districtId
        )!;
      }

      const tags = (item.RequestTags as any[]).map((tag) => {
        return { id: tag.tags.id, name: tag.tags.name };
      });

      return {
        id: item.id,
        provinceId: item.provinceId,
        districtId: item.districtId,
        location:
          item.isOnline === true
            ? "ONLINE"
            : `${districtName.name}, ${provinceName.name}`,
        title: item.title,
        description: item.description,
        dateTime: item.dateTime,
        tags: tags,
        reward: item.reward,
        additionalInformation: item.additionalInformation,
        specialRequest: item.specialRequest,
        isOnline: item.isOnline,
        status: item.status,
        createdAt: item.createdAt,
        user: {
          id: item.user.id,
          name: item.user.name,
          image: item.user.image,
        },
      };
    })
  );
};

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized" + session, { status: 401 });
    }

    const userId = (await user(session.user.email!))!.id;

    const request = await prisma.request.findMany({
      where: {
        NOT: {
          userId: userId,
        },
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
