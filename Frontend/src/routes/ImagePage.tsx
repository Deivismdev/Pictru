import CoordinateSelector from "@/components/CoordinateSelector";
import CommentForm from "@/components/forms/CommentForm";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BadgeInfoIcon,
  Eye,
  MousePointerClick,
  Scroll,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import React, { useState } from "react";

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

  const imageData = {
    id: 0,
    title: "Title",
    userName: "Usernameeee",
    likeCount: 6,
    dislikeCount: 420,
    viewCount: 420,
    imageUrl: "/assets/images/dangerfloof.jpg",
    comments: [
      {
        id: 0,
        user: "true lol",
        comment: "yo this website sucks",
        coordinates: null,
      },
      {
        id: 1,
        user: "true lol",
        comment: "yo this website sucks",
        coordinates: { x: 20, y: 20 },
      },
      {
        id: 2,
        user: "true lol",
        comment: "yo this website sucks",
        coordinates: { x: 50, y: 50 },
      },
      {
        id: 3,
        user: "true lol",
        comment: "yo this website sucks",
        coordinates: { x: 30, y: 70 },
      },
    ],
    tags: [0, 1, 2],
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio et laboriosam tenetur delectus aliquam sint n ipsum, dolor sit amet consectetur adipisicing elit. Distinctio et laboriosam tenetur delectus aliquam sint non quis est dolo ipsum, dolor sit amet consectetur adipisicing elit. Distinctio et laboriosam tenetur delectus aliquam sint non quis est dolo ipsum, dolor sit amet consectetur adipisicing elit. Distinctio et laboriosam tenetur delectus aliquam sint non quis est dolo ipsum, dolor sit amet consectetur adipisicing elit. Distinctio et laboriosam tenetur delectus aliquam sint non quis est doloon quis est dolores, dolore sapiente officiis explicabo inventore quae maxime eum fugit aspernatur deserunt?",
  };

  return (
    <div className="xl:px-36 px-12 flex flex-col text-foreground">
      <div className="grid grid-cols-2 p-2">
        <div className="col-span-1 flex flex-col">
          <div className="flex gap-6 text-2xl">
            <span>{imageData.userName}</span>
            <span className="font-bold">{imageData.title}</span>
          </div>
          <div className="flex gap-2">
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
              {imageData.viewCount}
            </span>
            <span className="flex gap-1">
              <ThumbsUp className="h-full w-auto" />
              {imageData.likeCount}
            </span>
          </div>
          <BadgeInfoIcon />
        </div>
      </div>

      <div className=" h-screen">
        <div className="flex md:flex-row flex-col-reverse h-4/5">
          <div className="w-1/2 ">
            <div className="border border-border rounded-sm flex flex-col h-full justify-between">
              <ScrollArea>
                {imageData.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-muted p-2 m-2 rounded-md hover:brightness-110"
                    onMouseEnter={() =>
                      setCommentCoordinates(comment.coordinates)
                    }
                    onMouseLeave={() => setCommentCoordinates(null)}
                  >
                    <div className="flex flex-row justify-between items-center">
                      <div className="brightness-75">{comment.user}</div>
                      {comment.coordinates && (
                        <MousePointerClick className="stroke-purple-500/20" />
                      )}
                    </div>
                    <div>{comment.comment}</div>
                  </div>
                ))}
              </ScrollArea>
              <div className="p-2">
                <CommentForm
                  onSelectImagePoint={() => setIsEnlarged(true)}
                  coordinates={selectedCoordinates}
                />
              </div>
            </div>
          </div>
          <div className="w-1/2 h-full">
            <div className="m-auto h-full w-max relative">
              <img
                src={imageData.imageUrl}
                className="w-auto h-full max-h-full object-contain m-auto"
                onClick={() => setIsEnlarged(true)}
                style={isEnlarged ? { display: "none" } : {}}
              />
              // user selected point
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
              // other users' selected points
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
            // enlarged image view
            {isEnlarged && (
              <div className="fixed inset-0 backdrop-blur-sm bg-purple-950/10 flex items-center justify-center z-50">
                <div
                  className="absolute inset-0"
                  onClick={() => setIsEnlarged(false)}
                ></div>
                <CoordinateSelector
                  onCoordinatesUpdate={handleCoordinatesUpdate}
                >
                  <img
                    src={imageData.imageUrl}
                    className="w-auto h-auto max-w-full max-h-full"
                  />
                </CoordinateSelector>
              </div>
            )}
          </div>
        </div>
        <div className="border border-border h-64 p-2 mt-6">
          <h6 className="font-bold">Description</h6>
          <ScrollArea className="h-full">{imageData.description}</ScrollArea>
        </div>
      </div>
    </div>
  );
}
