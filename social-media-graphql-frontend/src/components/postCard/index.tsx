import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PostCardComponentModel } from "../../models/component.model";
import AvatarLogo from "../avatar/AvatarLogo";
import { Button } from "../ui/button";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { Separator } from "../ui/separator";
import { timeDifference } from "../../lib/helperFunction";
import { useLocation, useNavigate } from "react-router-dom";

const PostCard: FC<PostCardComponentModel> = ({ data }) => {
  const {
    postId,
    ownerAvatar,
    ownerId,
    ownerName,
    createdAt,
    postText,
    likesCount,
    commentsCount,
    isLikedByMe,
  } = data;

  const navigate = useNavigate();
  const location = useLocation();

  const isPostOpened = location.pathname.includes(`/post/${postId}`);

  return (
    <Card key={postId} className="bg-secondary">
      <CardHeader className="w-full flex flex-row items-center justify-between">
        <div className="flex items-center gap-base">
          <AvatarLogo image={ownerAvatar} text={ownerName} />
          <Button
            variant="ghost"
            className={`px-0 ${isPostOpened ? "disabled:opacity-100" : ""}`}
            onClick={() => navigate(`/profile/${ownerId}`)}
          >
            {ownerName}
          </Button>
        </div>
        <span className="text-sm">{timeDifference(createdAt)}</span>
      </CardHeader>
      <CardContent className="max-h-60 overflow-y-auto">
        <p className="text-lg">{postText}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <div className="w-full flex items-center justify-between">
          <Button
            variant="ghost"
            className={`px-0 ${isPostOpened ? "disabled:opacity-100" : ""}`}
            onClick={() => navigate(`post/${postId}`)}
            disabled={isPostOpened}
          >
            {likesCount} Likes
          </Button>
          {/* Make the "Comments" label clickable and navigate to the post page */}
          <Button
            variant="ghost"
            className={`px-0 ${isPostOpened ? "disabled:opacity-100" : ""}`}
            onClick={() => navigate(`/post/${postId}`)}
            disabled={isPostOpened}
          >
            {commentsCount} Comments
          </Button>
        </div>
        <Separator className="my-2 dark:bg-slate-700" />
        <div className="w-full flex items-center justify-between">
          <Button variant="ghost" className="px-0">
            {isLikedByMe ? (
              <AiFillLike className="mr-2 h-4 w-4" />
            ) : (
              <AiOutlineLike className="mr-2 h-4 w-4" />
            )}
            Like
          </Button>
          <Button
            variant="ghost"
            className={`px-0 ${isPostOpened ? "disabled:opacity-100" : ""}`}
            onClick={() => navigate(`/post/${postId}`)}
            disabled={isPostOpened}
          >
            <BiComment className="mr-2 h-4 w-4" /> Comments
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
