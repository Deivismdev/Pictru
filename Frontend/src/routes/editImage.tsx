import ImageEditForm from "@/components/forms/ImageEditForm";
import { Image } from "@/lib/types";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

export async function loader({ params }: any) {
  console.log(params);
  const response = await fetch(
    `http://localhost:5095/api/image/${params.imageId}`
  );

  if (!response.ok) throw new Error("Error loading images");

  return response;
}

export default function EditImage() {
  const imageData = useLoaderData() as Image;

  const [image, setImage] = useState<Image>(imageData);

  return (
    <div className="xl:px-36 px-12 flex flex-col text-foreground bg-background pt-4">
      <div className="flex gap-12 text-4xl">
        <span>Edit image</span>
      </div>

      <div>
        <ImageEditForm imageData={image} />
      </div>
    </div>
  );
}
