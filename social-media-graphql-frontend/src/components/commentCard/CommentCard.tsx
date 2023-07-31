import { FC } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { CommentModel } from "../../models/component.model"; // Import the CommentModel interface
import AvatarLogo from "../avatar/AvatarLogo";
import { timeDifference } from "../../lib/helperFunction";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface CommentCardProps {
  data: CommentModel; // Adjust the prop type to use the CommentModel interface
}

const CommentCard: FC<CommentCardProps> = ({ data }) => {
  const { _id: commentId, comment, date: createdAt, commentOwner } = data; // Destructure the comment data

  const { _id: ownerId, name: ownerName, avatar: ownerAvatar } = commentOwner; // Destructure the commentOwner data

  const navigate = useNavigate();

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
                onClick={() => navigate(`/profile/${ownerId}`)}
              >
                {ownerName}
              </Button>
            </div>
            <span className="text-sm">{timeDifference(createdAt)}</span>
          </CardHeader>
          <CardContent>
            {/* Main Comment */}
            <p>{comment}</p> {/* Use the 'comment' data for the comment text */}
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
