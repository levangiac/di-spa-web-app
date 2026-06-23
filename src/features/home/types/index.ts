export type Category = {
  id: string;
  name: string;
  slug: string;
  iconName: string; // tên icon trong Phosphor
};

export type FeaturedBanner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  discountPercent?: number;
  href?: string;
};

export type HomeData = {
  categories: Category[];
  featuredBanners: FeaturedBanner[];
  nearbySpaIds: string[];
  topRatedSpaIds: string[];
};
