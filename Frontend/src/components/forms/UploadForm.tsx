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
    const asddata = {
      Name: "ImageName",
      Description: "ImageName",
      Tags: [TagNames.AIGenerated, TagNames.AIGenerated],
      File: data.File,
    };

    console.log(asddata);
    console.log(JSON.stringify(asddata));
    const response = await fetch(`http://localhost:5095/api/image`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "multipart/form-data",
        Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJwcmVtaXVtQGJvYmJlci5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicHJlbWl1bSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiM2NmZWU4NzQtYmM1Ny00NTU5LThjYTQtN2IzMDA0MjI1YjcwIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjpbIk1vZGVyYXRvciIsIk1lbWJlciJdLCJleHAiOjE3MTU4NjY2OTF9.wn1tLCsBBMngYErYAVx-iGZaudWH1ON-Ewxv9dGwlTixuWtSZrTppgDrIqCLfBHpit4jc9w3ds_3Ozebc8flww`,
      },
      body: JSON.stringify(asddata),
    });
    console.log(response);

    return true;
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
