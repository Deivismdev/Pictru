export type GalleryImage = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  viewCount: number;
  likeCount: number;
  reportCount: number;
  uploadDate: string;
  imageState: number;
  user: {
    username: string;
    description: string;
    reputation: number;
    isPremium: boolean;
    registerDate: string;
  };
  tags: number[];
};

export type Image = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  viewCount: number;
  likeCount: number;
  reportCount: number;
  uploadDate: string;
  imageState: number;
  user: {
    username: string;
    description: string;
    reputation: number;
    isPremium: boolean;
    registerDate: string;
  };
  imageComments: {
    id: number;
    text: string;
    date: string;
    xCoord: number | null;
    yCoord: number | null;
    userId: string;
    userName: string;
  }[];
  tags: number[];
};
