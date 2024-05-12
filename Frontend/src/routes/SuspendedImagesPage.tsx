import ImageCard from "@/components/ImageCard";
import SuspendedImageCard from "@/components/SuspendedImageCard";
import { useAuth } from "@/context/useAuth";
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { useState } from "react";

export default function SuspendedImagePage() {
  //   const profileData = useLoaderData() as any;
  //   const [profile, setProfile] = useState<UserProfile>(profileData);
  const [page, setPage] = useState(1);

  const [images, setImages] = useState<Array<any>>([]);
  const { user } = useAuth();

  const [stopFetching, setStopFetching] = useState(false);

  async function fetchPictures() {
    if (stopFetching) return;

    const result = await fetch(
      `http://localhost:5095/api/image?state=1&orderBy=uploadDate&pageNumber=${page}&pageSize=3&username=${user?.userName}`
    );
    if (result.ok) {
      const res = await result.json();
      setImages([...images, ...res]);
      setPage((p) => p + 1);
    } else if (result.status == 404) {
      setStopFetching(true);
    }
  }

  return (
    <div className=" w-full py-6 text-foreground m-auto">
      <div className="text-xl text-center w-full pb-6">
        suspended images uploaded by
        <span className="font-bold"> {user?.userName}</span>
      </div>

      <div className="px-36">
        <MasonryInfiniteGrid
          loading={<div className="animate-spin">/</div>}
          gap={24}
          column={4}
          onRequestAppend={(e) => {
            if (stopFetching) return;
            e.wait();
            setTimeout(() => {
              e.ready();
              fetchPictures();
              console.log("fetching" + page);
            }, 1000);
          }}
        >
          {images.map((image: any) => {
            return <SuspendedImageCard image={image} key={image.id} />;
          })}
        </MasonryInfiniteGrid>
      </div>
    </div>
  );
}
