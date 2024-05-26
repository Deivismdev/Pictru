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

// TODO: this is stupid, same thing in UploadForm.
// also, upload and edit forms could be one thing?
const tagDescriptionMap = {
  AIGenerated:
    "AIGenearted\nModel : <Please enter the model used to generate the image>\nPrompt: <Please enter the prompt used to generate the image>",
  Painting:
    "Painting\nMedium: <Please enter the medium used>\nCanvas: <Please enter the canvas details>",
  Photography:
    "Photography\nCamera: <Please enter the camera and settings used to take the picture>",
  DigitalArt: "DigitalArt\nSoftware: <Please enter the software used>\n",
  Render:
    "Render\nSoftware: <Please enter the software used>\nSettings: <Please enter the render settings>",
  Drawing:
    "Drawing\nMedium: <Please enter the medium used>\nPaper: <Please enter the paper details>",
  Other: "Other\nDetails: <Please provide relevant details>",
};

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
  const [description, setDescription] = useState<string>(imageData.description);

  // console.log(imageData);

  useEffect(() => {
    setPicturePreview(imageData.imageUrl);
  }, []);

  const onSubmit = async (values: z.infer<typeof EditValidation>) => {
    const formData = {
      name: values.Name,
      description: description,
      tags: values.Tags, // Convert tag names to strings
    };

    console.log("formData:");
    console.log(formData);

    const response = await fetch(
      `http://localhost:5095/api/image/${imageData.id}`,
      {
        method: "PATCH",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
      throw new Error("Failed to update the image");
    }

    if (response.ok) {
      navigate(`/gallery/image/${imageData.id}`);
    }
  };

  const updateDescription = (selectedTags: TagNames[]) => {
    const newDescription = selectedTags
      .map((tag) => tagDescriptionMap[TagNames[tag]])
      .join("\n\n");
    setDescription(newDescription);
  };

  const handleToggleChange = (newSelection: string[]) => {
    const enumSelection = newSelection.map(
      (tag) => TagNames[tag as keyof typeof TagNames]
    );

    form.setValue("Tags", enumSelection as [TagNames, ...TagNames[]]);
    updateDescription(enumSelection as TagNames[]);
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
                  {/* <Input type="text" placeholder="description" {...field} /> */}
                  <textarea
                    className="h-32 w-full text-start bg-background border-border border rounded-md text-xl text-foreground p-2"
                    placeholder="description"
                    {...field}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
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
