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
  BotIcon,
  BoxIcon,
  BrushIcon,
  CameraIcon,
  ChevronDown,
  CircleDotIcon,
  Laptop2Icon,
  PaletteIcon,
} from "lucide-react";
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { useState } from "react";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState(1);

  const [stopFetching, setStopFetching] = useState(false);
  const [filter, setFilter] = useState<number | null>(null);
  const [sort, setSort] = useState<string | null>(null);

  const filterOptions = [
    {
      id: 0,
      name: "AI Generated",
      icon: <BotIcon className="mr-2" />,
    },
    {
      id: 1,
      name: "Painting",
      icon: <PaletteIcon className="mr-2" />,
    },
    {
      id: 2,
      name: "Photography",
      icon: <CameraIcon className="mr-2" />,
    },
    {
      id: 3,
      name: "Digital art",
      icon: <Laptop2Icon className="mr-2" />,
    },
    {
      id: 4,
      name: "Render",
      icon: <BoxIcon className="mr-2" />,
    },
    {
      id: 5,
      name: "Drawing",
      icon: <BrushIcon className="mr-2" />,
    },
    {
      id: 6,
      name: "Other",
      icon: <CircleDotIcon className="mr-2" />,
    },
  ];

  async function fetchPictures() {
    if (stopFetching) return;

    let filterURL = "";
    if (filter) {
      filterURL = `tag=${filter}&`;
    }

    let sortURL = "orderBy=uploaddatedesc";
    if (sort) {
      sortURL = `orderBy=${sort}&`;
    }

    const result = await fetch(
      `http://localhost:5095/api/image?${filterURL}state=0&${sortURL}&pageNumber=${page}&pageSize=5`
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
    <div className="text-foreground m-auto w-9/12">
      <h1 className="text-3xl py-2">Gallery</h1>
      <ScrollArea className="py-2 w-full whitespace-nowrap h-20" type="always">
        <div className="flex w-max gap-3 h-max">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                {sort === "viewcountdesc" ? "Top" : "New"}
                <ChevronDown className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setSort("viewcountdesc");
                  setImages([]);
                  setPage(1);
                  setStopFetching(false);
                }}
              >
                Top
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSort("uploaddatedesc");
                  setImages([]);
                  setPage(1);
                  setStopFetching(false);
                }}
              >
                New
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              className="border border-border"
              variant={filter === option.id ? "default" : "outline"}
              onClick={() => {
                setFilter(filter == option.id ? null : option.id);
                console.log(filter == option.id ? null : option.id);
                setImages([]);
                setPage(1);
                setStopFetching(false);
                // fetchPictures();
              }}
            >
              {option.icon}
              {option.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <MasonryInfiniteGrid
        loading={<div className="animate-spin text-primary text-2xl">/</div>}
        gap={3} //vertical gap
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
