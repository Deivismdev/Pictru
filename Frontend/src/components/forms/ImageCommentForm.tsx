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
import {
  MousePointerClick,
  SendHorizonal,
  SendIcon,
  XCircleIcon,
} from "lucide-react";
import { useAuth } from "@/context/useAuth";
import { useEffect } from "react";

interface CommentFormProps {
  onSelectImagePoint: () => void;
  onCommentSubmit: () => void;
  onCancelEdit: () => void;
  coordinates: { x: number; y: number } | null;
  imageId: number;
  commentToEdit: null | {
    id: number;
    comment: string;
  };
}

const ImageCommentForm = ({
  onSelectImagePoint,
  coordinates,
  imageId,
  onCommentSubmit,
  commentToEdit,
  onCancelEdit,
}: CommentFormProps) => {
  const formSchema = z.object({
    comment: z.string().min(3, {
      message: "Comment must be at least 3 characters.",
    }),
  });

  const { token } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  useEffect(() => {
    if (commentToEdit) {
      form.setValue("comment", commentToEdit.comment);
    } else {
      form.setValue("comment", "");
    }
  }, [commentToEdit]);

  async function handleCommentSubmit(values: z.infer<typeof formSchema>) {
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

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const res = await response.json();

    console.log(res);

    onCommentSubmit();

    form.reset();
  }
  async function handleCommentEdit(values: z.infer<typeof formSchema>) {
    const data = {
      text: values.comment,
      id: commentToEdit?.id,
    };

    const response = await fetch(
      `http://localhost:5095/api/images/${imageId}/comments/${commentToEdit?.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    onCommentSubmit();

    form.reset();
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (commentToEdit) {
      handleCommentEdit(values);
    } else {
      handleCommentSubmit(values);
    }

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
          render={({ field }) =>
            commentToEdit ? (
              <FormItem>
                <FormLabel>Edit a comment</FormLabel>
                <div className="flex">
                  <Button
                    type="button"
                    variant={"destructive"}
                    onClick={onCancelEdit}
                  >
                    <XCircleIcon />
                  </Button>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <Button type="submit">
                    <SendIcon />
                  </Button>
                </div>
              </FormItem>
            ) : (
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
            )
          }
        />
      </form>
    </Form>
  );
};

export default ImageCommentForm;
