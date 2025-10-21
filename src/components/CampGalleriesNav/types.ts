export interface CampGallery {
  name: string;
  slug: string;
  previewImage: string;
  photoCount: number;
  location: string;
  yearActive: string;
}

export const campGalleries: CampGallery[] = [
  {
    name: "Manzanar",
    slug: "manzanar",
    previewImage: "/internment-camps/manzanar-internment-camp-entrance_kxzjwp",
    photoCount: 12,
    location: "California",
    yearActive: "1942-1945"
  },
  {
    name: "Heart Mountain",
    slug: "heart-mountain",
    previewImage: "/internment-camps/heart-mountain-internment-camp-root-cellar_pmvgnl",
    photoCount: 8,
    location: "Wyoming",
    yearActive: "1942-1945"
  },
  {
    name: "Tule Lake",
    slug: "tule-lake",
    previewImage: "/internment-camps/tule-lake-internment-camp_qvzpkt",
    photoCount: 10,
    location: "California",
    yearActive: "1942-1946"
  },
  // Add other camps...
];
