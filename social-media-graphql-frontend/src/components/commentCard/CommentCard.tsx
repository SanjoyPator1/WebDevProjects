import React, { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CommentCardComponentModel } from "../../models/component.model";
import AvatarLogo from "../avatar/AvatarLogo";
import { Separator } from "../ui/separator";
import { timeDifference } from "../../lib/helperFunction";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { VscTriangleLeft } from "react-icons/vsc";

const CommentCard: FC<CommentCardComponentModel> = ({ data }) => {
  const { commentId, ownerAvatar, ownerName, createdAt, commentText } = data;

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div key={commentId} className="px-2 w-full flex flex-wrap gap-md md:gap-lg">
      <div className="flex-none mt-1">
        <AvatarLogo image={ownerAvatar} text={ownerName} />
      </div>
      <div className="flex-1">
        <Card className="w-fit max-w-full bg-muted relative">
          {/* Comment pointer to avatar */}
          <div className="absolute top-4 -left-3 bg-muted w-6 h-6 border border-t-0 border-r-0 border-t-indigo-500 rotate-45 "></div>
          <CardHeader className="py-2 w-full flex flex-row items-center justify-between gap-md">
            <div className="flex items-center gap-base">
              {/* Clicking on the comment owner name takes them to their profile */}
              <Button
                variant="ghost"
                className={`px-0 `}
                onClick={() => navigate(`/profile/${data.ownerId}`)}
              >
                {ownerName}
              </Button>
            </div>
            <span className="text-sm">{timeDifference(createdAt)}</span>
          </CardHeader>
          <CardContent>
            {/* Main Comment */}
            <p>{commentText}</p>
          </CardContent>
          {/* <Separator className="my-2" /> */}
          {false && (
            <div className="w-full flex items-center justify-end">
              hi
              {/* Additional actions for comments can be added here */}
              {/* For example, a button to reply to the comment */}
              {/* <Button onClick={() => handleReplyClick(commentId)}>Reply</Button> */}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CommentCard;
