import { TagNames } from "@/lib/tags";
import { GalleryImage } from "@/lib/types";
import { ThumbsUpIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface ImageCardProps {
  image: GalleryImage;
}

export default function ImageCard({ image }: ImageCardProps) {
  return (
    <NavLink
      className="w-[400px] group relative"
      to={`/gallery/image/${image.id}`}
    >
      <div className="hidden p-2 justify-between text-white text-xl flex-col text-center items-center group-hover:flex absolute backdrop-brightness-[0.20] w-full h-full">
        <div className="">
          <div>
            {image.user.isPremium && "⭐"} {image.user.username}{" "}
            {image.user.isPremium && "⭐"}
          </div>
          <div>"{image.name}"</div>
        </div>
        <div className="">
          <div>
            {image.tags.slice(0, 3).map((tag, index) => (
              <div key={index}>{TagNames[tag]}</div>
            ))}
            {image.tags.length > 3 && (
              <div className="text-sm">{image.tags.length - 3} more tags</div>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-3 items-center self-end">
          <div>{image.likeCount}</div>
          <ThumbsUpIcon />
        </div>
      </div>
      <div className="border-none overflow-hidden object-contain">
        <img className="max-w-full w-full h-auto" src={image.imageUrl} alt="" />
      </div>
    </NavLink>
  );
}
