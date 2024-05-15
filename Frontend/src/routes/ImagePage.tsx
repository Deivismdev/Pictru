import CoordinateSelector from "@/components/CoordinateSelector";
import ImageCommentForm from "@/components/forms/ImageCommentForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/useAuth";
import { TagNames } from "@/lib/tags";
import { Image as imageType } from "@/lib/types";
import {
  Eye,
  MessageCircleWarningIcon,
  MousePointerClick,
  ThumbsUp,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLoaderData, useNavigate } from "react-router-dom";
import { number } from "zod";

export async function loader({ params }: any) {
  console.log(params);
  // const { user } = useAuth();
  // const userId = user ? `?userId=${encodeURIComponent(user.userId)}` : "";
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

  const imageData = useLoaderData() as imageType;

  // document.title = `PICTRU | "${imageData.name}"`;
  const { token, user } = useAuth();
  const [image, setImage] = useState<imageType>(imageData);
  const [liked, setLiked] = useState<Boolean>(false);
  const [imageClass, setImageClass] = useState(""); // State to hold the CSS class for the image
  const navigate = useNavigate();

  const imageRef = useRef<HTMLImageElement>(null); // Ref to access the image element

  useEffect(() => {
    const img = new Image();
    img.src = image.imageUrl;
    img.onload = () => {
      console.log(imageRef);
      if (imageRef.current) {
        const aspectRatio = img.width / img.height;
        if (aspectRatio > 1) {
          // Image is wider
          setImageClass("w-full h-max");
          console.log("WIDER");
        } else {
          // Image is taller
          setImageClass("h-full w-max");
          console.log("TALLER");
        }
      }
    };
  }, [image.imageUrl]);
  // if image is wider, w-full h-max, if taller, h-full w-max

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

  async function onDeleteClick(imageId: number) {
    try {
      const response = await fetch(
        `http://localhost:5095/api/image/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      console.log("Image deleted successfully");
      navigate(`/user/${imageData.user.id}`);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async function onLikeClick(imageId: any) {
    const token = localStorage.getItem("token");
    //TODO: Need new endpoint to get image like count
    const response = await fetch(`http://localhost:5095/api/${imageId}/likes`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("oof");
    }

    // setImage({ ...image, likeCount: image.likeCount + 1 });
    setLiked(true);
    console.log("Imageliked");
  }

  async function onReportClick(imageId: any) {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5095/api/${imageId}/reports`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("oof");
    }
    console.log("Image reported");
  }

  return (
    <div className="xl:px-36 px-12 flex flex-col text-foreground bg-background">
      <div className="grid grid-cols-2 p-2">
        <div className="col-span-1 flex flex-col">
          <div className="flex gap-12 text-4xl">
            <span>"{image.name}"</span>
          </div>
          <div className="flex gap-12 text-xl">
            <span>
              Uploaded by:{" "}
              <NavLink
                className="font-bold hover:underline"
                to={`/user/${image.user.id}`}
              >
                {image.user.username}
              </NavLink>
            </span>
          </div>
          <div className="flex gap-2 pt-3">
            {image.tags.map((tag) => (
              <Badge>{TagNames[tag]}</Badge>
            ))}
          </div>
        </div>
        <div className="col-span-1 flex self-center justify-between text-2xl">
          <div className="flex flex-row gap-12 items-center">
            <span className="flex gap-1 items-center">
              <Eye className="size-10" />
              {image.viewCount}
            </span>
            <span className="flex gap-1 items-center">
              <button onClick={() => onLikeClick(image.id)}>
                <ThumbsUp
                  className={`size-10 hover:stroke-green-500 ${
                    liked && "fill-white "
                  }`}
                />
              </button>
              {image.likeCount + Number(liked)}
            </span>
          </div>
          <span className="flex gap-5 items-center">
            <span className="text-sm ">Report mistagged image</span>
            {/* Change badge to more report like? */}
            <button onClick={() => onReportClick(image.id)}>
              <MessageCircleWarningIcon className="hover:stroke-red-700 size-10" />
            </button>
          </span>
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
            <div className={`m-auto flex items-center h-full justify-center `}>
              <div className={`m-auto ${imageClass} relative`}>
                <img
                  src={image.imageUrl}
                  ref={imageRef}
                  // TODO: IMAGE OVERFLOWS REEE
                  className={`object-contain m-auto w-full h-full`}
                  onClick={() => setIsEnlarged(true)}
                  style={isEnlarged ? { display: "none" } : {}}
                />
                {selectedCoordinates && (
                  <div
                    className={`${
                      isEnlarged && "hidden"
                    } absolute w-[50px] h-[50px] border-2 bg-primary/20 border-secondary rounded-full`}
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
                    } absolute w-[50px] h-[50px] border-2 bg-primary/30 border-secondary rounded-full backdrop-invert`}
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

        <div className="flex gap-6 pt-4">
          {(image.user.id === user?.userId ||
            user?.roles.includes("Moderator")) && (
            <>
              <Button
                className="w-16"
                type="submit"
                onClick={() => navigate(`/editImage/${image.id}`)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                className="w-16"
                type="submit"
                onClick={() => onDeleteClick(image.id)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
