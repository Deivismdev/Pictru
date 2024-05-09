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
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
// import { UploadValidation } from "@/lib/validation";
import { ok } from "assert";

export default function UploadForm() {
  const form = useForm();

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("Name", data.Name);
    formData.append("Description", data.Description);

    const file = data.File;
    formData.append("File", file); // append the file object to FormData

    const tagNames = data.Tags.map((tagId: any) => TagNames[tagId]);
    formData.append("Tags", JSON.stringify(tagNames));

    console.log(formData);

    try {
      const response = await fetch("http://localhost:5095/api/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not OK");
      }

      const result = await response.json();
      console.log("Image created successfully:", result);
    } catch (error) {
      console.error("Error creating image:", error);
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
                  <Input placeholder="title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <label>Tags:</label>
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
                  <Input placeholder="title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-1 h-full">
          <FormField
            control={form.control}
            name="File"
            render={({ field }) => (
              <FormItem className="h-full w-full">
                <FormLabel>Image</FormLabel>
                <FormControl className="flex items-center content-center">
                  <Input className="h-full w-full" type="file" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button className="w-1/2" type="submit">
          Post
        </Button>
      </form>
    </Form>
  );
}
