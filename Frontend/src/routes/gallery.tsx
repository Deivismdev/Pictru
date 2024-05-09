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

export async function loader({ params }: any) {
  const response = await fetch(
    `http://localhost:5095/api/image?orderBy=uploadDate&pageNumber=1&pageSize=10`
  );
  if (!response.ok) throw new Error("Error loading images");

  return response;
}

export default function Gallery() {
  const images = useLoaderData() as GalleryImage[];

  return (
    <div className="text-foreground m-auto w-9/12">
      <h1 className="text-3xl py-2">Gallery</h1>
      <ScrollArea className="py-2 w-full whitespace-nowrap h-20" type="always">
        <div className="flex w-max gap-3 h-max">
          <DropdownMenu>
            <DropdownMenuTrigger>
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

      <div className="flex flex-col gap-6">
        {images.map((image) => (
          <div>
            {image.id} <img src={image.imageUrl}></img>
          </div>
        ))}
      </div>
    </div>
  );
}
