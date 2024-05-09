import ProfileCommentForm from "@/components/forms/ProfileCommentForm";
import ProfileEditForm from "@/components/forms/ProfileEditForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

export async function loader({ params }: any) {
  const profileData = {
    id: params.profileId,
    username: "Usernameeee",
    reputation: -6,
    avatar: "/assets/images/image1.jpg",
    comments: [
      {
        id: 0,
        user: "true lol",
        comment: "yo this website sucks",
        date: new Date().toDateString(),
        coordinates: null,
      },
      {
        id: 1,
        user: "true lol",
        date: new Date().toDateString(),
        comment: "yo this website sucks",
      },
      {
        id: 2,
        user: "true lol",
        date: new Date().toDateString(),
        comment: "yo this website sucks",
      },
      {
        id: 3,
        user: "true lol",
        date: new Date().toDateString(),
        comment: "yo this website sucks",
      },
    ],
    description:
      "Lets talk about me... Lets talk about the 6 foot 8 frame, the 37 inch  vertical leap, the black steel that drips down my back AKA the bullet  proof mullet, the Google prototype scopes with built in LCD LED 1080p 3D  Sony technology. like my images pls. leave a comment",

    images: [
      "/assets/images/dangerfloof.jpg",
      "/assets/images/dangerfloof.jpg",
      "/assets/images/dangerfloof.jpg",
    ],
  };
  //const user = await getContact(params.contactId);
  return { profileData };
}

export default function ProfilePage() {
  const { profileData } = useLoaderData() as any;

  const [IsEditing, setIsEditing] = useState(false);

  console.log(profileData);

  return (
    <div className="xl:px-36 px-12 flex flex-col text-foreground bg-background items-center">
      <div className="w-2/3 xl:w-92 mt-12 flex flex-row gap-24 justify-between h-1/2">
        <div className="flex-1 border-border border p-6 rounded-md">
          <div className="flex justify-between">
            <div className="flex flex-col justify-between">
              {!IsEditing ? (
                <>
                  <div className="font-bold text-3xl px-3 pb-6">
                    user profile
                  </div>
                  <div className="flex flex-row justify-between p-3">
                    <div className="flex flex-col justify-between">
                      <div className="text-2xl font-bold">
                        {profileData.username}
                      </div>
                      <div className="text-xl">
                        reputation: {profileData.reputation}
                      </div>
                      <div className="text-2xl flex items-center">
                        About
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4"
                        >
                          <PencilIcon className="stroke-primary" />
                        </button>
                      </div>
                    </div>
                    <div className="max-w-48 max-h-48 relative">
                      <img
                        src={profileData.avatar}
                        className="w-48 h-32 object-cover rounded-sm m-auto"
                      />
                    </div>
                  </div>
                  <div>
                    <ScrollArea className="bg-muted p-3 rounded-sm h-48">
                      {profileData.description}
                    </ScrollArea>
                  </div>
                </>
              ) : (
                <>
                  <ProfileEditForm
                    endEdit={() => setIsEditing(false)}
                    profileData={profileData}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 h-full rounded-md border-border border p-4 ">
          <div>
            <span>Comments</span>
            <div>
              <ScrollArea>
                {profileData.comments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="bg-muted p-2 m-2 rounded-md hover:brightness-110"
                  >
                    <div className="flex flex-row justify-between items-center">
                      <div className="brightness-75">{comment.user}</div>
                    </div>
                    <div>{comment.comment}</div>
                  </div>
                ))}
              </ScrollArea>
              <ProfileCommentForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
