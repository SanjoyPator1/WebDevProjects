import React from "react";
import { Button } from "../ui/button";
import AvatarLogo from "../avatar/AvatarLogo";
import { ProfileInfoCardProps } from "../../models/component.model";
import { BsPersonFillAdd, BsFillPersonCheckFill } from "react-icons/bs";
import { BiSolidUserX } from "react-icons/bi";
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
  console.log({ friendStatus }); //values of friendStatus "self" | "friend" | "pendingByUser" | "pendingByLoggedInUser" | "notFriend"

  return (
    <div className="w-full flex flex-col gap-base bg-primary-foreground p-4 rounded-lg">
      <div
        className={`flex ${
          displayType == "short" ? "flex-row" : "flex-col"
        } justify-between gap-base`}
      >
        <div className="flex items-center justify-start gap-base">
          {/* Avatar */}
          <AvatarLogo image={avatar!} text={name} />
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
            {friendStatus === "friend" && (
              <Button variant="outline" className="w-44">
                Friend
              </Button>
            )}
            {(friendStatus === "notFriend" ||
              friendStatus === "pendingByLoggedInUser") && (
              <Button variant="default" className="w-44">
                {friendStatus === "notFriend" ? (
                  <BsPersonFillAdd className="mr-2 h-4 w-4" />
                ) : (
                  <BsFillPersonCheckFill className="mr-2 h-4 w-4" />
                )}
                {friendStatus === "notFriend"
                  ? "Add Friend"
                  : "Confirm Request"}
              </Button>
            )}
            {(friendStatus === "pendingByLoggedInUser" ||
              friendStatus === "pendingByUser") && (
              <Button variant="destructive" className="w-40">
                <BiSolidUserX className="mr-2 h-4 w-4" />
                {friendStatus === "pendingByLoggedInUser"
                  ? "Delete Request"
                  : "Cancel Request"}
              </Button>
            )}
            {/* Message Button */}
            <Button
              className="w-32"
              variant={friendStatus !== "friend" ? "outline" : "ghost"}
            >
              <AiFillMessage className="mr-2 h-4 w-4" />
              Message
            </Button>
          </div>
        )}
      </div>
      {/* Bio */}
      {displayType !== "short" && <p className="text-gray-600">{bio ? bio : "no bio to show"}</p>}
    </div>
  );
};

export default ProfileInfoCard;
