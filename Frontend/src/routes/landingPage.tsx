import ImageCard from "@/components/ImageCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [stopFetching, setStopFetching] = useState(false);
  const [images, setImages] = useState<any>([]);
  const [page, setPage] = useState(1);

  async function fetchPictures() {
    if (stopFetching) return;

    const result = await fetch(
      `http://localhost:5095/api/image?state=0&orderBy=uploadDate&pageNumber=${page}&pageSize=5`
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
    <>
      <section className="container text-foreground grid lg:grid-cols-2 place-items-center pt-20 md:py-32 gap-10">
        <div className="text-center lg:text-start space-y-6">
          <main className="text-5xl md:text-6xl font-bold">
            <h1 className="inline">
              <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
                Sharing Images
              </span>{" "}
              Honoring Authenticity
            </h1>{" "}
          </main>

          <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
            From candid shots to creative edits, truth is in the tags.
            Showcasing a range of visuals, ensuring accurate labels that capture
            the authenticity of each frame.
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button
              className="w-full md:w-1/3 text-2xl"
              onClick={() => navigate("/register")}
            >
              Join now
            </Button>
          </div>
          <div>or explore images below</div>
        </div>
      </section>

      <div className=" w-full px-96">
        <div className="text-xl text-center w-full pb-6">
          images uploaded by our users
        </div>
        <MasonryInfiniteGrid
          loading={<div className="animate-spin">/</div>}
          gap={3}
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
            return <ImageCard image={image} key={image.id} />;
          })}
        </MasonryInfiniteGrid>
      </div>
    </>
  );
}
