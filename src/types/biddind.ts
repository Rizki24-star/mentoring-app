import { Tag } from "./tag";

export type BiddingRequest = {
  status: string;
  title: string;
  reward: number;
  location: string;
  tags: Tag[];
};
