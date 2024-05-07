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
import { ProfileEditValidation } from "@/lib/validation";
import { CheckIcon, XIcon } from "lucide-react";

interface CommentFormProps {
  endEdit: () => void;
  profileData: any;
}

export default function ProfileEditForm({
  endEdit,
  profileData,
}: CommentFormProps) {
  const form = useForm<z.infer<typeof ProfileEditValidation>>({
    resolver: zodResolver(ProfileEditValidation),
  });

  const onSubmit = (data: z.infer<typeof ProfileEditValidation>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="font-bold text-3xl px-3 pb-6">
          Edit your description or profile picture
        </div>
        <div className="flex flex-row justify-between p-3">
          <div className="flex flex-col justify-between">
            <div className="text-2xl font-bold">{profileData.username}</div>
            <span className="text-2xl font-bold w-24 rounded-full bg-muted"></span>
            <div className="text-xl w-16 rounded-full bg-muted" />
            <div className="text-2xl flex items-center"></div>
          </div>
          <div className="max-w-48 max-h-48 relative">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="h-full w-full">
                  <FormLabel>Image</FormLabel>
                  <FormControl className="flex items-center content-center">
                    <Input
                      className="w-48 h-32"
                      accept="image/*"
                      type="file"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    className="h-full w-full text-start bg-background border-border border rounded-md text-xl text-foreground p-2"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-6">
          <Button type="submit" className="px-4">
            <CheckIcon />
          </Button>
          <Button onClick={endEdit} className="px-4">
            <XIcon />
          </Button>
        </div>
      </form>
    </Form>
  );
}
