import React from "react";
import { Link } from "react-router-dom";
import AvatarLogo from "../avatar/AvatarLogo";
import { timeDifference } from "../../lib/helperFunction";

interface NotificationCardProps {
  _id: string;
  creatorUser: {
    _id: string;
    name: string;
    avatar: string;
  };
  module: string;
  action: string;
  linkId: string;
  createdAt: string;
  seen: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  creatorUser,
  module,
  action,
  createdAt,
  linkId,
  seen,
}) => {
  // Construct the message based on module and action
  let message = "";
  let linkPath = "";
  if (module === "POST") {
    if (action === "LIKE") {
      message = ` liked your post`;
    } else if (action === "COMMENT") {
      message = ` commented on your post`;
    }
    linkPath = `/post/${linkId}`;
  } else if (module === "FRIEND_REQUEST") {
    if (action === "SEND_FRIEND_REQUEST") {
      message = ` sent you a friend request`;
    } else if (action === "ACCEPTED_FRIEND_REQUEST") {
      message = ` accepted your friend request`;
    }
    linkPath = `/profile/${linkId}`;
  }

  return (
    <Link
      to={linkPath}
      className={`w-full flex items-center gap-base p-base-container rounded-md ${
        !seen ? "bg-secondary" : "bg-primary-foreground"
      }`}
    >
      <AvatarLogo image={creatorUser.avatar} text={creatorUser.name} />
      <div className="flex-1 flex flex-col justify-center">
        <p className="mb-1 text-sm">
          <Link to={`/profile/${creatorUser._id}`} className="font-semibold">
            {creatorUser.name}
          </Link>{" "}
          {message}
        </p>
        <p className="text-xs text-gray-500">
          {timeDifference(createdAt.toString())}
        </p>
      </div>
      {!seen && <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary"></div>}
    </Link>
  );
};

export default NotificationCard;
