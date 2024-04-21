import CommentForm from "@/components/forms/CommentForm";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BadgeInfoIcon, Scroll, ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useState } from "react";

export default function ImagePage() {
  const [isEnlarged, setIsEnlarged] = useState(false);

  const imageData = {
    id: 0,
    title: "Title",
    userName: "Usernameeee",
    likeCount: 6,
    dislikeCount: 420,
    viewCount: 420,
    imageUrl: "/assets/images/dangerfloof.jpg",
    comments: [
      { id: 0, user: "true lol", comment: "yo this website sucks" },
      { id: 0, user: "true lol", comment: "yo this website sucks" },
      { id: 0, user: "true lol", comment: "yo this website sucks" },
      { id: 0, user: "true lol", comment: "yo this website sucks" },
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
          <div className="flex gap-3">
            <span className="flex gap-1">
              <ThumbsUp className="h-full w-auto" />
              {imageData.likeCount}
            </span>
            <span className="flex gap-1">
              <ThumbsDown className="h-full w-auto" />
              {imageData.dislikeCount}
            </span>
          </div>
          <BadgeInfoIcon />
        </div>
      </div>

      <div className=" h-screen">
        <div className="flex md:flex-row flex-col-reverse h-4/5">
          <div className="flex-1 ">
            <div className="border border-border rounded-sm flex flex-col h-full justify-between">
              {/* // TODO: each child must have a key */}
              <ScrollArea>
                {imageData.comments.map((comment) => (
                  <div className="bg-muted p-2 m-2 rounded-md hover:brightness-110">
                    <div className="brightness-75">{comment.user}</div>
                    <div>{comment.comment}</div>
                  </div>
                ))}
              </ScrollArea>

              <div className="p-2">
                <CommentForm />
              </div>
            </div>
          </div>
          <div className="flex-1 ">
            <img
              src={imageData.imageUrl}
              className="w-auto h-full m-auto object-scale-down"
              onClick={() => setIsEnlarged(true)}
              style={isEnlarged ? { display: "none" } : {}}
            />
            {isEnlarged && (
              <div className="fixed inset-0 backdrop-blur-sm bg-purple-950/10 flex items-center justify-center z-50">
                <div
                  className="absolute inset-0"
                  onClick={() => setIsEnlarged(false)}
                ></div>
                <img
                  src={imageData.imageUrl}
                  className="w-auto h-auto max-w-full max-h-full"
                />
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
