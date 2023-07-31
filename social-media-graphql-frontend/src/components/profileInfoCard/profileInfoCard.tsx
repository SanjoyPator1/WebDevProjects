import React from "react";
import { Button } from "../ui/button";
import AvatarLogo from "../avatar/AvatarLogo";
import { ProfileInfoCardProps } from "../../models/component.model";
import { BsPersonFillAdd, BsFillPersonCheckFill } from "react-icons/bs";
import { AiFillMessage } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  profileId,
  avatar,
  name,
  friendStatus,
  bio,
  isOwnProfile = false,
  displayType = "short",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isProfileOpened = location.pathname.includes(`/profile/${profileId}`);

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
          <Button
            variant="ghost"
            className={`px-0 ${isProfileOpened ? "disabled:opacity-100" : ""}`}
            onClick={() => navigate(`/profile/${profileId}`)}
            disabled={isProfileOpened}
          >
            {name}
          </Button>
          <h2
            className={`${
              displayType !== "short" ? "text-xl font-bold" : "text-base"
            }`}
          ></h2>
        </div>
        {/* Friend Request or Friend Status */}
        {!isOwnProfile && (
          <div
            className={`flex flex-wrap gap-base  ${
              displayType === "short" && "justify-end"
            } items-center`}
          >
            <Button
              variant={friendStatus === "friend" ? "outline" : "default"}
              className="w-32"
            >
              {friendStatus === "friend" ? (
                <BsFillPersonCheckFill className="mr-2 h-4 w-4" />
              ) : (
                <BsPersonFillAdd className="mr-2 h-4 w-4" />
              )}
              {friendStatus === "friend" ? "Friend" : "Add Friend"}
            </Button>
            {/* Message Button */}
            <Button
              className="w-32"
              variant={friendStatus === "friend" ? "outline" : "ghost"}
            >
              <AiFillMessage className="mr-2 h-4 w-4" />
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
