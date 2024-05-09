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

interface CommentFormProps {
  onSelectImagePoint: () => void;
  coordinates: { x: number; y: number } | null;
}

const ImageCommentForm = ({
  onSelectImagePoint,
  coordinates,
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
    const imageId = 1;

    const data = {
      text: values.comment,
      xCoord: coordinates ? Math.round(coordinates?.x) : null,
      yCoord: coordinates ? Math.round(coordinates?.y) : null,
    };

    const response = await fetch(
      `http://localhost:5095/api/images/${1}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJwcmVtaXVtQGJvYmJlci5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicHJlbWl1bSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiM2NmZWU4NzQtYmM1Ny00NTU5LThjYTQtN2IzMDA0MjI1YjcwIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjpbIk1vZGVyYXRvciIsIk1lbWJlciJdLCJleHAiOjE3MTU4NzExNDR9.1FKfVNXFiKyR_lE-nLwCSHYlwZmHed8LC7suIY7rQoM6DngLaXuDIgzb9UtPlyB_YSiX2KT0_qONMhnLW4YgXQ`,
        },
        body: JSON.stringify(data),
      }
    );
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
