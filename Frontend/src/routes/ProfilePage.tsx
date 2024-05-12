import ImageCard from "@/components/ImageCard";
import ProfileCommentForm from "@/components/forms/ProfileCommentForm";
import ProfileEditForm from "@/components/forms/ProfileEditForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/useAuth";
import { UserProfile } from "@/lib/types";
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
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
  const [page, setPage] = useState(1);

  const [images, setImages] = useState<any>([]);
  const { user } = useAuth();

  const [stopFetching, setStopFetching] = useState(false);

  async function fetchPictures() {
    if (stopFetching) return;

    const result = await fetch(
      `http://localhost:5095/api/image?state=0&orderBy=uploadDate&pageNumber=${page}&pageSize=3&username=${profile.username}`
    );
    if (result.ok) {
      const res = await result.json();
      setImages([...images, ...res]);
      setPage((p) => p + 1);
    } else if (result.status == 404) {
      setStopFetching(true);
    }
  }

  async function onProfileEdit(
    newProfile: { description: string; imageUrl: string } | null
  ) {
    setIsEditing(false);

    console.log(newProfile);
    console.log("newProfile");

    if (newProfile) {
      console.warn("yes");
      setProfile((prevState) => ({
        ...prevState,
        description: newProfile.description,
        imageUrl: newProfile.imageUrl,
      }));
    }

    console.log(profile);
  }

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
      <div className="w-2/3 xl:w-92 mt-12 flex flex-row gap-24 justify-between h-full">
        <div className="flex-1 border-border border p-6 rounded-md">
          <div className="flex flex-col justify-between w-full">
            {!IsEditing ? (
              <>
                <div className="font-bold text-3xl px-3 pb-6">user profile</div>
                <div className="flex flex-row justify-between p-3">
                  <div className="flex flex-col justify-between">
                    <div className="text-2xl font-bold">{profile.username}</div>
                    <div className="text-xl">
                      reputation: {profile.reputation}
                    </div>
                    <div className="text-2xl flex items-center">
                      About
                      {profile.id === user?.userId && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4"
                        >
                          <PencilIcon className="stroke-primary" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-w-48 max-h-48 relative">
                    <img
                      src={profile.imageUrl}
                      className="w-48 h-32 object-cover rounded-sm m-auto"
                    />
                  </div>
                </div>

                {/* <ScrollArea className="bg-muted p-3 rounded-sm h-full bg-red-200">
                  {profile.description}
                </ScrollArea> */}
                <div className="overflow-y-auto text-wrap bg-muted p-3 rounded-sm h-32 w-full break-all ">
                  {profile.description}
                </div>
              </>
            ) : (
              <>
                <ProfileEditForm
                  endEdit={onProfileEdit}
                  profileData={profile}
                  userId={profile.id}
                />
              </>
            )}
          </div>
        </div>
        <div className="flex-1 h-full rounded-md border-border border p-4">
          <div>
            <span>Comments</span>
            <div>
              <ScrollArea className="h-72">
                {profile.profileComments.map((comment: any) => (
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
      <div className=" w-full py-6">
        <div className="text-xl text-center w-full pb-6">
          images uploaded by{" "}
          <span className="font-bold">{profile.username}</span>
        </div>
        <MasonryInfiniteGrid
          loading={<div className="animate-spin">/</div>}
          gap={3}
          column={4}
          onRequestAppend={(e) => {
            if (stopFetching) return;
            e.wait();
            setTimeout(() => {
              e.ready();
              fetchPictures();
              console.log("fetching" + page);
            }, 1000);
          }}
        >
          {images.map((image: any) => {
            return <ImageCard image={image} key={image.id} />;
          })}
        </MasonryInfiniteGrid>
      </div>
    </div>
  );
}
