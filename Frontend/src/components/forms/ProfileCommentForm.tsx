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
import { MousePointerClick, SendHorizonal } from "lucide-react";



const ProfileCommentForm = () => {
  const formSchema = z.object({
    comment: z.string().min(3, {
      message: "Comment must be at least 3 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  // TODO: it has no user id, maybe pass the submit outside the compoennt?
  function onSubmit(values: z.infer<typeof formSchema>) {
    //TODO: submit comment
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 w-full mt-4"
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leave a comment</FormLabel>
              <div className="flex">
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <Button type="submit">
                  <SendHorizonal />
                </Button>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ProfileCommentForm;