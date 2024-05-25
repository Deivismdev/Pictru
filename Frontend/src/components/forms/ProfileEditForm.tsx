import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { CheckIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface CommentFormProps {
  endEdit: (
    newProfile: { description: string; imageUrl: string } | null
  ) => void;
  profileData: any;
  userId: string;
}

const ProfileEditForm = ({
  endEdit,
  profileData,
  userId,
}: CommentFormProps) => {
  const form = useForm();
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    form.setValue("description", profileData.description);
    form.setValue("imageUrl", profileData.imageUrl);
    setDescription(profileData.description);
    if (profileData.imageUrl) {
      createFileFromUrl(profileData.imageUrl).then((file) => {
        setFile(file);
      });
    }
  }, [profileData, form]);

  async function createFileFromUrl(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], "image.jpg", { type: blob.type });
    return file;
  }

  async function onSubmit(values: any) {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("Description", description);

    if (file) formData.append("File", file, file.name);

    const response = await fetch(`http://localhost:5095/api/user/${userId}`, {
      method: "PATCH",
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
    form.reset();
    setIsLoading(false);
    endEdit({ description: res.description, imageUrl: res.imageUrl });
  }

  const handleDescriptionChange = (event: any) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  return (
    <Form {...form}>
      <form
        encType="multipart/form-data"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="font-bold text-3xl px-3 pb-6">
          Edit your description or profile picture
        </div>
        <div className="flex flex-row justify-between p-3">
          <div className="flex flex-col justify-between">
            <div className="text-2xl font-bold">{profileData.username}</div>
          </div>
          <div className="max-w-48 max-h-48 relative">
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                className="w-48 h-32 object-cover rounded-sm m-auto"
              />
            ) : (
              <img
                src={profileData.imageUrl}
                className="w-48 h-32 object-cover rounded-sm m-auto"
              />
            )}
            <input type="file" onChange={handleFileChange} />
          </div>
        </div>
        <div>
          <textarea
            className="h-full w-full text-start bg-background border-border border rounded-md text-xl text-foreground p-2"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div className="flex gap-6">
          <Button disabled={isLoading} type="submit" className="px-4">
            <CheckIcon />
          </Button>
          <Button onClick={() => endEdit(null)} className="px-4">
            <XIcon />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileEditForm;
