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
    defaultValues: {
      Name: imageData.name,
      Description: imageData.description,
      // Tags: imageData.tags.map((tag) =>
      //   Object.keys(TagNames).find(
      //     (key) => TagNames[key as keyof typeof TagNames] === tag
      //   )
      // ), TODO: idk if its possible with shadcn toggle group
    },
  });

  const { token } = useAuth();
  const [picturePreview, setPicturePreview] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setPicturePreview(imageData.imageUrl);
  }, []);
  const onSubmit = async (values: z.infer<typeof EditValidation>) => {
    const response = await fetch(
      `http://localhost:5095/api/image/${imageData.id}`,
      {
        method: "PATCH",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("oof");
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
          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

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
          <FormField
            control={form.control}
            name="Description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button className="w-1/2 mt-10" type="submit">
            Save changes
          </Button>
        </div>
        <div className="m-auto h-4/5 w-4/5 relative">
          <img src={picturePreview} />
        </div>
      </form>
    </Form>
  );
}