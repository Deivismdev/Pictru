import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { TagNames } from "@/lib/tags";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
// import { UploadValidation } from "@/lib/validation";
import { EditValidation } from "@/lib/validation";
import { useAuth } from "@/context/useAuth";
import { Image } from "@/lib/types";
import { useNavigate } from "react-router-dom";

interface EditFormProps {
  imageData: Image;
}

export default function ImageEditForm({ imageData }: EditFormProps) {
  const form = useForm<z.infer<typeof EditValidation>>({
    resolver: zodResolver(EditValidation),
  });

  const { token } = useAuth();
  const [picturePreview, setPicturePreview] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setPicturePreview(imageData.imageUrl);
  }, []);
  const onSubmit = async (values: z.infer<typeof EditValidation>) => {
    const response = await fetch(
      `http://localhost:5095/api/image/suspended/${imageData.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ tags: values.Tags }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not OK");
    }

    if (response.ok) {
      navigate(`/gallery/image/${imageData.id}`);
    }
  };

  const handleToggleChange = (newSelection: string[]) => {
    const enumSelection = newSelection.map(
      (tag) => TagNames[tag as keyof typeof TagNames]
    );

    form.setValue("Tags", enumSelection as [TagNames, ...TagNames[]]);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-5 w-full mt-4 grid grid-cols-2"
      >
        <div className="col-span-1">
          <FormItem>
            <FormLabel>Title</FormLabel>
            <div>{imageData.name}</div>
          </FormItem>
          <FormLabel>Tags:</FormLabel>
          <ToggleGroup
            type="multiple"
            variant="outline"
            onValueChange={handleToggleChange}
            className="justify-start"
          >
            {(Object.values(TagNames) as TagNames[]).map((value) => {
              if (!isNaN(Number(value))) {
                return;
              }
              return (
                <ToggleGroupItem
                  value={value.toString()}
                  aria-label="Toggle bold"
                  key={value}
                >
                  {value}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
          <FormItem>
            <FormLabel>Description</FormLabel>
            <div>{imageData.description}</div>
          </FormItem>
        </div>

        <div className="col-span-1 relative h-full">
          <img
            src={picturePreview}
            className={`absolute top-10 left-0 h-full w-full z-0 object-contain ${
              picturePreview ? "block" : "hidden"
            }`}
          />
        </div>

        <Button className="w-1/2" type="submit">
          Update
        </Button>
      </form>
    </Form>
  );
}
