export type UserProfile = {
  name: string;
  image: string;
  whatsappNumber: string;
  about: string;
  tags: { id: number; name: string }[];
};
