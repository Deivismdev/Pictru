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
import { UploadValidation } from "@/lib/validation";

export default function UploadForm() {
  const form = useForm<z.infer<typeof UploadValidation>>({
    resolver: zodResolver(
      UploadValidation
    ),
  });

  const onSubmit = (data: z.infer<typeof UploadValidation>) => {
    console.log(data);
  };

  const handleToggleChange = (newSelection: string[]) => {
    const enumSelection = newSelection.map(
      (tag) => TagNames[tag as keyof typeof TagNames]
    );

    form.setValue('tags', enumSelection as [TagNames, ...TagNames[]]);
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
            name="title"
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
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Details</FormLabel>
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
            name="image"
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

        <Button className="w-1/2" type="submit">Post</Button>
      </form>
    </Form>
  );
}
