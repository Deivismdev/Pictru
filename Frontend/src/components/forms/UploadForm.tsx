import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { TagNames } from "@/lib/tags";
import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { UploadValidation } from "@/lib/validation";
import { useAuth } from "@/context/useAuth";

interface UploadFormProps {
  onImageUpload: (id: number) => void;
}

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

export default function UploadForm({ onImageUpload }: UploadFormProps) {
  const form = useForm<z.infer<typeof UploadValidation>>({
    resolver: zodResolver(UploadValidation),
  });

  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [picturePreview, setPicturePreview] = useState<any>(null);
  const [description, setDescription] = useState<string>("");

  const onSubmit = async (values: z.infer<typeof UploadValidation>) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("Name", values.Name);
    formData.append("Description", description);

    if (values.File) formData.append("File", values.File, values.File.name);

    for (const tag of values.Tags) {
      formData.append("Tags[]", tag.toString());
    }

    const response = await fetch("http://localhost:5095/api/image", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        Authorization: `bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not OK");
    }

    const res = await response.json();
    onImageUpload(res.id);

    form.reset({ Description: "", Name: "", Tags: [], File: undefined });
    setDescription("");
    setIsLoading(false);
  };

  const handleToggleChange = (newSelection: string[]) => {
    const enumSelection = newSelection.map(
      (tag) => TagNames[tag as keyof typeof TagNames]
    );

    form.setValue("Tags", enumSelection as [TagNames, ...TagNames[]]);
    updateDescription(enumSelection as TagNames[]);
  };

  const updateDescription = (selectedTags: TagNames[]) => {
    const newDescription = selectedTags
      .map((tag) => tagDescriptionMap[TagNames[tag]])
      .join("\n\n");
    setDescription(newDescription);
  };

  return (
    <Form {...form}>
      <span className="text-3xl">Image Upload</span>

      <form
        encType="multipart/form-data"
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
                <FormMessage />
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
                return null;
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
                  <textarea
                    className="h-32 w-full text-start bg-background border-border border rounded-md text-xl text-foreground p-2"
                    placeholder="description"
                    {...field}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value), console.log("CHANGE");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-1 h-full">
          <FormField
            control={form.control}
            name="File"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem className="h-full w-full relative">
                <FormLabel>Picture</FormLabel>
                <FormControl className="flex items-center content-center absolute top-5 left-0 z-10">
                  <Input
                    type="file"
                    placeholder="Select picture here"
                    {...field}
                    onChange={(event) => {
                      if (!event.target.files) return;

                      const file = event.target.files[0] ?? null;
                      onChange(file);
                      setPicturePreview(URL.createObjectURL(file));
                    }}
                  />
                </FormControl>
                <img
                  src={picturePreview}
                  className={`absolute top-10 left-0 h-full w-full z-0 object-contain ${
                    picturePreview ? "block" : "hidden"
                  }`}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isLoading} className="w-1/4" type="submit">
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </form>
    </Form>
  );
}
