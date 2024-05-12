import UploadForm from "@/components/forms/UploadForm";
import { useState } from "react";
import { NavLink } from "react-router-dom";


export default function UploadPage() {

  const [imageId, setImageId] = useState<number| null>(null);

  function onCreateImage(id: number)
  {
    setImageId(id);
  }

  return (
    <div className="xl:px-36 px-12 flex flex-col text-foreground bg-background">
      <div>
        <UploadForm onImageUpload={onCreateImage}/>
      </div>
      {imageId && <div className="text-foreground text-xl">Your image has been uploaded, you can view your submission <NavLink className="underline" to={`/gallery/image/${imageId}`}>Here</NavLink></div>}
    </div>
  );
}
