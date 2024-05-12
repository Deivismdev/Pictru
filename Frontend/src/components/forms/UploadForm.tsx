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
import { UploadValidation } from "@/lib/validation";
import { useAuth } from "@/context/useAuth";

interface UploadFormProps {
  onImageUpload: ((id: number) => void);
}

export default function UploadForm({onImageUpload} : UploadFormProps) {
  const form = useForm<z.infer<typeof UploadValidation>>({
    resolver: zodResolver(UploadValidation),
  });

  const { token } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof UploadValidation>) => {

    setIsLoading(true);
    const formData = new FormData();
    // const token = localStorage.getItem("token");

    formData.append("Name", values.Name);
    formData.append("Description", values.Description);

    if (values.File) formData.append("File", values.File, values.File.name);

    for (let tag of values.Tags) {
      formData.append("Tags[]", tag.toString());
    }

    console.log(formData);

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

    form.reset({Description: "", Name: "", Tags: [], File: undefined});

    setIsLoading(false);

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
        </div>

        <div className="col-span-1 h-full">
          <FormField
            control={form.control}
            name="File"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem className="h-full w-full">
                <FormLabel>Picture</FormLabel>
                <FormControl className="flex items-center content-center">
                  <Input
                    className="h-full w-full"
                    type="file"
                    {...field}
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button disabled={isLoading} className="w-1/2" type="submit">
          {isLoading ? "Posting...":"Post"}
        </Button>
      </form>
    </Form>
  );
}
