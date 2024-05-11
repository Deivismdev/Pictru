import ProfileCommentForm from "@/components/forms/ProfileCommentForm";
import ProfileEditForm from "@/components/forms/ProfileEditForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserProfile } from "@/lib/types";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";

export async function loader({ params }: any) {
  const response = await fetch(
    `http://localhost:5095/api/user/${params.profileId}`
  );
  if (!response.ok) throw new Error("Error loading images");

  return response;
}
export default function ProfilePage() {
  const profileData = useLoaderData() as any;
  const [profile, setProfile] = useState<UserProfile>(profileData);
  const [IsEditing, setIsEditing] = useState(false);

  async function onCommentSubmit() {
    const response = await fetch(
      `http://localhost:5095/api/profiles/${profile.id}/comments`
    );
    if (!response.ok) throw new Error("Error loading comments");
    else {
      console.log("HEREEEEE AAAH");
      console.log(response.body);
      const data = await response.json();

      setProfile((prevProfile) => ({ ...prevProfile, profileComments: data }));
    }
  }

  return (
    <div className="xl:px-36 px-12 flex flex-col text-foreground bg-background items-center">
      <div className="w-2/3 xl:w-92 mt-12 flex flex-row gap-24 justify-between h-1/2">
        <div className="flex-1 border-border border p-6 rounded-md">
          <div className="flex flex-col justify-between w-full">
            {!IsEditing ? (
              <>
                <div className="font-bold text-3xl px-3 pb-6">user profile</div>
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
                      src={profileData.imageUrl}
                      className="w-48 h-32 object-cover rounded-sm m-auto"
                    />
                  </div>
                </div>

                <ScrollArea className="bg-muted p-3 rounded-sm ">
                  <div>{profileData.description}</div>
                </ScrollArea>
              </>
            ) : (
              <>
                <ProfileEditForm
                  endEdit={() => setIsEditing(false)}
                  profileData={profileData}
                  userId={profile.id}
                />
              </>
            )}
          </div>
        </div>
        <div className="flex-1 h-full rounded-md border-border border p-4 ">
          <div>
            <span>Comments</span>
            <div>
              <ScrollArea>
                {profileData.profileComments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="bg-muted p-2 m-2 rounded-md hover:brightness-110"
                  >
                    <div className="flex flex-row justify-between items-center">
                      <div className="brightness-75">{comment.userName}</div>
                    </div>
                    <div>{comment.text}</div>
                  </div>
                ))}
              </ScrollArea>
              <ProfileCommentForm
                onCommentSubmit={onCommentSubmit}
                userId={profile.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
