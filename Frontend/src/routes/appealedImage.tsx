import CoordinateSelector from "@/components/CoordinateSelector";
import SuspendedImageEditForm from "@/components/forms/SuspendedImageEditForm";
import ImageEditForm from "@/components/forms/SuspendedImageEditForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/useAuth";
import { TagNames } from "@/lib/tags";
// import { Image } from "@/lib/types";
import { Eye, MousePointerClick, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { NavLink, useNavigate, useParams } from "react-router-dom";

export async function loader({ params }: any) {
  console.log(params);
  const response = await fetch(
    `http://localhost:5095/api/image/${params.imageId}`
  );

  if (!response.ok) throw new Error("Error loading images");

  return response;
}

export default function AppealedImage() {
  const imageData = useLoaderData() as any;
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [image, setImage] = useState<any>(imageData);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageClass, setImageClass] = useState("");
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

  useEffect(() => {
    if (!image) return;
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
  }, [image?.imageUrl]);

  async function onApproveClick(imageId: number) {
    try {
      const response = await fetch(
        `http://localhost:5095/api/image/appealed/${imageId}`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      console.log("Image activated!");
      navigate(`/gallery/image/${imageId}`);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <div className="xl:px-36 px-12 flex flex-col text-foreground bg-background">
      <div className="grid grid-cols-2 p-2">
        <div className="col-span-1 flex flex-col">
          <div className="flex gap-12 text-4xl">
            <span>
              Appealed by:{" "}
              <NavLink
                className="font-bold hover:underline"
                to={`/user/${image.user.id}`}
              >
                {image.user.username}
              </NavLink>
            </span>
          </div>
          <div className="flex gap-12 text-xl">
            <span>Check if tags represent the image:</span>
          </div>
          <div className="flex gap-2 pt-3">
            {image.tags.map((tag: any) => (
              <Badge className="text-3xl" key={TagNames[tag]}>
                {TagNames[tag]}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className=" h-screen">
        <div className="flex md:flex-row flex-col-reverse h-4/5">
          <div className="flex-1 ">
            <div className="border border-border rounded-sm flex flex-col h-full justify-between">
              <ScrollArea>
                {image.imageComments.map((comment: any) => (
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
            </div>
          </div>
          <div className="flex-1 h-full w-full flex items-center justify-center">
            <div className={`m-auto flex items-center h-full justify-center `}>
              <div className={`m-auto ${imageClass} relative`}>
                <img
                  src={image.imageUrl}
                  ref={imageRef}
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
        <div className="flex gap-6 pt-4">
          {(image.user.id === user?.userId ||
            user?.roles.includes("Moderator")) && (
            <>
              <Button
                className="w-26"
                type="submit"
                onClick={() => onApproveClick(image.id)}
              >
                Approve image
              </Button>
              {/* TODO: ahh this is stupid need new endpoint to change state to suspended */}
              {/* <Button
                variant="destructive"
                className="w-26"
                type="submit"
                onClick={() => onSuspendedClick(image.id)}
              >
                Move to suspended
              </Button> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
