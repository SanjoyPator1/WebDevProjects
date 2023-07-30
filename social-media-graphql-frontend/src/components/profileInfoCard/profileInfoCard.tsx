import React from "react";
import { Button } from "../ui/button";
import AvatarLogo from "../avatar/AvatarLogo";
import { ProfileInfoCardProps } from "../../models/component.model";

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  avatar,
  name,
  friendStatus,
  bio,
  isOwnProfile=false,
  displayType = "short",
}) => {
  return (
    <div className="w-full flex flex-col gap-base bg-primary-foreground p-4 rounded-lg">
      <div
        className={`flex ${
          displayType == "short" ? "flex-row" : "flex-col"
        } justify-between gap-base`}
      >
        <div className="flex items-center justify-start gap-base">
          {/* Avatar */}
          <AvatarLogo image={avatar} text={name} />
          {/* Profile Name */}
          <h2 className={`${displayType!=="short" ? "text-xl font-bold": "text-base"}`}>{name}</h2>
        </div>
        {/* Friend Request or Friend Status */}
        {!isOwnProfile && (
          <div className="flex flex-wrap gap-base justify-end items-center">
            <Button
              variant={friendStatus === "friend" ? "outline" : "default"}
              className="mr-2"
            >
              {friendStatus === "friend" ? "Friend" : "Add Friend"}
            </Button>
            {/* Message Button */}
            <Button variant={friendStatus === "friend" ? "default" : "outline"}>
              Message
            </Button>
          </div>
        )}
      </div>
      {/* Bio */}
      {displayType !== "short" && <p className="text-gray-600">{bio}</p>}
    </div>
  );
};

export default ProfileInfoCard;
