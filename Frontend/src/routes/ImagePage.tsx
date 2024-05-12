import CoordinateSelector from "@/components/CoordinateSelector";
import ImageCommentForm from "@/components/forms/ImageCommentForm";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image } from "@/lib/types";
import { BadgeInfoIcon, Eye, MousePointerClick, ThumbsUp } from "lucide-react";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";

export async function loader({ params }: any) {
  console.log(params);
  const response = await fetch(
    `http://localhost:5095/api/image/${params.imageId}`
  );
  if (!response.ok) throw new Error("Error loading images");

  return response;
}

export default function ImagePage() {
  const [isEnlarged, setIsEnlarged] = useState(false);

  const [selectedCoordinates, setIsSelectedCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [commentCoordinates, setCommentCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleCoordinatesUpdate = (coordinates: { x: number; y: number }) => {
    setIsEnlarged(false);
    setIsSelectedCoordinates(coordinates);
  };

  const imageData = useLoaderData() as Image;

  document.title = `PICTRU | "${imageData.name}"`

  const [image, setImage] = useState<Image>(imageData);

  async function onCommentSubmit() {
    const response = await fetch(
      `http://localhost:5095/api/images/${image.id}/comments`
    );
    if (!response.ok) throw new Error("Error loading comments");
    else {
      console.log(response.body);
      const data = await response.json();

      setImage((prevImage) => ({ ...prevImage, imageComments: data }));
    }
  }

  return (
    <div className="xl:px-36 px-12 flex flex-col text-foreground bg-background">
      <div className="grid grid-cols-2 p-2">
        <div className="col-span-1 flex flex-col">
          <div className="flex gap-12 text-4xl">
            <span>"{image.name}"</span>
          </div>
          <div className="flex gap-12 text-xl">
            <span>Uploaded by: {image.user.username}</span>
          </div>
          <div className="flex gap-2 pt-3">
            <Badge>sad</Badge>
            <Badge>cat</Badge>
            <Badge>nature</Badge>
            <Badge>ai-generated</Badge>
          </div>
        </div>
        <div className="col-span-1 flex self-center justify-between text-2xl">
          <div className="flex gap-6">
            <span className="flex gap-1">
              <Eye className="h-full w-auto" />
              {image.viewCount}
            </span>
            <span className="flex gap-1">
              <ThumbsUp className="h-full w-auto" />
              {image.likeCount}
            </span>
          </div>
          {/* Change badge to more report like? */}
          <BadgeInfoIcon className="stroke-red-700 size-10" />
        </div>
      </div>

      <div className=" h-screen">
        <div className="flex md:flex-row flex-col-reverse h-4/5">
          <div className="flex-1 ">
            <div className="border border-border rounded-sm flex flex-col h-full justify-between">
              <ScrollArea>
                {image.imageComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-muted p-2 m-2 rounded-md hover:brightness-110"
                    onMouseEnter={() => {
                      if (comment.xCoord && comment.yCoord)
                        setCommentCoordinates({
                          x: comment.xCoord,
                          y: comment.yCoord,
                        });
                    }}
                    onMouseLeave={() => setCommentCoordinates(null)}
                  >
                    <div className="flex flex-row justify-between items-center">
                      <div className="brightness-75">{comment.userName}</div>
                      {comment.xCoord && comment.yCoord && (
                        <MousePointerClick className="stroke-white" />
                      )}
                    </div>
                    <div>{comment.text}</div>
                  </div>
                ))}
              </ScrollArea>
              <div className="p-2">
                <ImageCommentForm
                  onCommentSubmit={onCommentSubmit}
                  imageId={image.id}
                  onSelectImagePoint={() => setIsEnlarged(true)}
                  coordinates={selectedCoordinates}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 h-full w-full flex items-center justify-center">
            <div className="m-auto flex items-center h-max w-full justify-center">
              <div className="m-auto h-full w-full relative">
                <img
                  src={image.imageUrl}
                  className="w-full h-full object-contain m-auto"
                  onClick={() => setIsEnlarged(true)}
                  style={isEnlarged ? { display: "none" } : {}}
                />
                {selectedCoordinates && (
                  <div
                    className={`${
                      isEnlarged && "hidden"
                    } absolute w-[30px] h-[30px] border-2 bg-primary/20 border-secondary rounded-full`}
                    style={{
                      left: `${selectedCoordinates.x}%`,
                      top: `${selectedCoordinates.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
                {commentCoordinates && (
                  <div
                    className={`${
                      isEnlarged && "hidden"
                    } absolute w-[30px] h-[30px] border-2 bg-primary/30 border-secondary rounded-full backdrop-invert`}
                    style={{
                      left: `${commentCoordinates.x}%`,
                      top: `${commentCoordinates.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
              </div>
            </div>
            {isEnlarged && (
              <div className="fixed inset-0 backdrop-blur-sm bg-purple-950/10 flex items-center justify-center z-50">
                <div
                  className="absolute inset-0"
                  onClick={() => setIsEnlarged(false)}
                ></div>
                <CoordinateSelector
                  onCoordinatesUpdate={handleCoordinatesUpdate}
                >
                  <img src={image.imageUrl} className="w-auto h-full" />
                </CoordinateSelector>
              </div>
            )}
          </div>
        </div>
        <div className="border border-border h-max p-2 mt-6">
          <h6 className="font-bold">Description</h6>
          <ScrollArea className="h-full">{image.description}</ScrollArea>
        </div>
      </div>
    </div>
  );
}
