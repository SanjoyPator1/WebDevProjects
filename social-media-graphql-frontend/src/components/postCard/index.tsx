import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { PostCardComponentModel } from "../../models/component.model";
import AvatarLogo from "../avatar/AvatarLogo";
import { Button } from "../ui/button";
import { AiOutlineLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { Separator } from "../ui/separator";
import { format, differenceInMinutes, differenceInHours } from "date-fns";

const PostCard: FC<PostCardComponentModel> = ({ data }) => {
  const {
    postId,
    ownerAvatar,
    ownerName,
    createdAt,
    postText,
    likesCount,
    commentsCount,
  } = data;

  // Calculate the time difference between now and the post creation time
  const timeDifference = () => {
    const currentTime = new Date();
    const postTime = new Date(createdAt);
  
    const minutesDiff = differenceInMinutes(currentTime, postTime);
    const hoursDiff = differenceInHours(currentTime, postTime);
  
    if (hoursDiff >= 24) {
      // If more than or equal to 24 hours, show the date in "14 March 2023" format
      return format(postTime, "dd MMMM yyyy");
    } else if (hoursDiff >= 1) {
      // If less than 24 hours but more than or equal to 1 hour, show hours ago
      return `${hoursDiff} ${hoursDiff === 1 ? "hour" : "hours"} ago`;
    } else {
      // If less than 1 hour, show minutes ago
      return `${minutesDiff} ${minutesDiff === 1 ? "minute" : "minutes"} ago`;
    }
  };

  return (
    <Card key={postId}>
      <CardHeader className="w-full flex flex-row items-center justify-between">
        <div className="flex items-center gap-base">
          <AvatarLogo image={ownerAvatar} text={ownerName} />
          <span>{ownerName}</span>
        </div>
        <span className="text-sm">{timeDifference()}</span>
      </CardHeader>
      <CardContent className="max-h-60 overflow-y-auto">
        <p className="text-lg">{postText}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <div className="w-full flex items-center justify-between">
          <Label>{likesCount} Likes</Label>
          <Label>{commentsCount} Comments</Label>
        </div>
        <Separator className="my-2" />
        <div className="w-full flex items-center justify-between">
          <Button variant="ghost" className="px-0">
            <AiOutlineLike className="mr-2 h-4 w-4" /> Like
          </Button>
          <Button variant="ghost" className="px-0">
            <BiComment className="mr-2 h-4 w-4" /> Comments
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
