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
  friendId,
  bio,
  displayType = "short",
  onSendFriendRequest,
  onRespondToFriendRequest,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isProfileOpened = location.pathname.includes(`/profile/${profileId}`);
  // console.log({ friendStatus }); //values of friendStatus "self" | "friend" | "pendingByUser" | "pendingByLoggedInUser" | "notFriend"
  // console.log({ friendId });
  return (
    <div
      key={profileId}
      className="w-full flex flex-col gap-base bg-primary-foreground p-4 rounded-lg"
    >
      <div
        className={`flex ${
          displayType === "short" ? "flex-row" : "flex-col"
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
        {friendStatus !== "self" && (
          <div
            className={`flex flex-wrap gap-base  ${
              displayType === "short" && "justify-end"
            } items-center`}
          >
            {friendStatus === "notFriend" && (
              <Button
                variant="default"
                className="w-28 md:w-44"
                onClick={() => onSendFriendRequest?.(profileId)}
              >
                <BsPersonFillAdd className="mr-2 h-4 w-4" />
                <div className="flex gap-1 items-center text-xs md:text-sm">
                  Add <p className="hidden md:block">Friend</p>
                </div>
              </Button>
            )}
            {friendStatus === "pendingByLoggedInUser" && (
              <Button
                variant="default"
                className="w-28 md:w-44"
                onClick={() =>
                  onRespondToFriendRequest?.("accepted", friendId!)
                }
              >
                <BsFillPersonCheckFill className="mr-2 h-4 w-4" />
                <div className="flex gap-1 items-center text-xs md:text-sm">
                  Confirm <p className="hidden md:block">Request</p>
                </div>
              </Button>
            )}
            {(friendStatus === "friend" ||
              friendStatus === "pendingByLoggedInUser" ||
              friendStatus === "pendingByUser") && (
              <Button
                variant="destructive"
                className="w-28 md:w-44"
                onClick={() =>
                  onRespondToFriendRequest?.("cancelled", friendId!)
                }
              >
                <BiSolidUserX className="mr-2 h-5 w-5" />
                {friendStatus === "friend" ? (
                  <div className="flex gap-1 items-center text-xs md:text-sm">
                    Unfriend <p className="hidden md:block"> Request</p>
                  </div>
                ) : friendStatus === "pendingByLoggedInUser" ? (
                  <div className="flex gap-1 items-center text-xs md:text-sm">
                    Delete <p className="hidden md:block">Request</p>
                  </div>
                ) : (
                  <div className="flex gap-1 items-center text-xs md:text-sm">
                    Cancel <p className="hidden md:block">Request</p>
                  </div>
                )}
              </Button>
            )}

            {/* Message Button */}
            <Button
              className="w-28 md:w-44 "
              variant={friendStatus !== "friend" ? "outline" : "ghost"}
            >
              <AiFillMessage className="mr-2 h-4 w-4" />
              <div className="text-xs md:text-sm">Message</div>
            </Button>
          </div>
        )}
      </div>
      {/* Bio */}
      {displayType !== "short" && (
        <p className="text-gray-600">{bio ? bio : "no bio to show"}</p>
      )}
    </div>
  );
};

export default ProfileInfoCard;
