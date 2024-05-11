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
import { useAuth } from "@/context/useAuth";

interface CommentFormProps {
  onSelectImagePoint: () => void;
  onCommentSubmit: () => void;
  coordinates: { x: number; y: number } | null;
  imageId: number;
}

const ImageCommentForm = ({
  onSelectImagePoint,
  coordinates,
  imageId,
  onCommentSubmit,
}: CommentFormProps) => {
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
  async function onSubmit(values: z.infer<typeof formSchema>) {
    //TODO: submit comment
    console.log(coordinates);
    console.log(values);

    const token = localStorage.getItem("token");

    const data = {
      text: values.comment,
      xCoord: coordinates ? Math.round(coordinates?.x) : null,
      yCoord: coordinates ? Math.round(coordinates?.y) : null,
    };

    const response = await fetch(
      `http://localhost:5095/api/images/${imageId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    onCommentSubmit();
    console.log(response);
    return true;
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
                <Button type="button" onClick={onSelectImagePoint}>
                  <MousePointerClick />
                </Button>
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

export default ImageCommentForm;
