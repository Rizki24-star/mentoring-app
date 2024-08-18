import { RequestStatus } from "@prisma/client";

export type RequestForm = {};

export type Request = {
  id: number;
  title: string;
  reward?: number | string;
  tags: { id: number; name: string }[];
  provinceId: number;
  districtId: number;
  location: string;
  createdAt: string;
  status: RequestStatus;
  totalBid: number;
  user: {
    id: string;
    name: string;
    image: string;
    email?: string;
  };
};

export type TMyRequest = Omit<Request, "user">;

export type RequestDetail = Request & {
  description: string;
  dateTime: string;
  additionalInformation: string;
  specialRequest: string;
};
