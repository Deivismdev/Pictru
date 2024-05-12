import ImageCard from "@/components/ImageCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GalleryImage } from "@/lib/types";
import {
  Brush,
  Car,
  ChevronDown,
  Laptop2,
  Leaf,
  Pizza,
  Rabbit,
} from "lucide-react";
import { useLoaderData } from "react-router-dom";
import {
  MasonryInfiniteGrid,
  PackingInfiniteGrid,
} from "@egjs/react-infinitegrid";
import { useEffect, useState } from "react";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState(1);

  const [stopFetching, setStopFetching] = useState(false);

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

  // if (images.length === 0) {
  //   return (
  //     <div>
  //       <h1 className="text-3xl py-2 text-foreground text-center w-full">
  //         No more images{" "}
  //       </h1>
  //     </div>
  //   );
  // }

  return (
    <div className="text-foreground m-auto w-9/12">
      <h1 className="text-3xl py-2">Gallery</h1>
      <ScrollArea className="py-2 w-full whitespace-nowrap h-20" type="always">
        <div className="flex w-max gap-3 h-max">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                New
                <ChevronDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Hot</DropdownMenuItem>
              <DropdownMenuItem>Top</DropdownMenuItem>
              <DropdownMenuItem>Best</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant={"default"}>
            <Pizza className="mr-2" />
            Food
          </Button>
          <Button variant={"outline"}>
            <Car className="mr-2" />
            Vehicle
          </Button>
          <Button variant={"outline"}>
            <Brush className="mr-2" />
            Paintings
          </Button>
          <Button variant={"outline"}>
            <Laptop2 className="mr-2" />
            Digital art
          </Button>
          <Button variant={"outline"}>
            <Leaf className="mr-2" />
            Nature
          </Button>
          <Button variant={"outline"}>
            <Rabbit className="mr-2" />
            Animals
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

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
        {images.map((image) => {
          return <ImageCard image={image} key={image.id} />;
        })}
      </MasonryInfiniteGrid>
    </div>
  );
}
