export type SpaDetail = {
  id: string;
  name: string;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  openHours: { day: string; open: string; close: string }[];
  isOpenNow: boolean;
  services: SpaService[];
  tags: string[];
};

export type SpaService = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // phút
  imageUrl?: string;
  category: string;
};

export type SpaReview = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
};
