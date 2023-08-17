import { FC, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import AvatarLogo from "../avatar/AvatarLogo";
import { Button } from "../ui/button";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { Separator } from "../ui/separator";
import { timeDifference } from "../../lib/helperFunction";
import { useLocation, useNavigate } from "react-router-dom";
import { PostModel } from "../../models/component.model";
import { useMutation } from "@apollo/client";
import { GET_POST_BY_ID, UPDATE_POST } from "../../graphql/queries/postQueries";
import EditDialog from "../EditDialog/EditDialog";
import { useToast } from "../ui/use-toast";
import client from "../../graphql/apolloClient";

interface PostCardProps {
  data: PostModel;
  onLikePost: () => void;
  onUnlikePost: () => void;
  showEditOptions?: boolean;
  isMyPost?: boolean;
}

const PostCard: FC<PostCardProps> = ({
  data,
  onLikePost,
  onUnlikePost,
  showEditOptions = false,
  isMyPost,
}) => {
  const {
    _id: postId,
    owner: { _id: ownerId, name: ownerName, avatar: ownerAvatar },
    createdAt,
    message: postText,
    likesCount,
    commentsCount,
    isLikedByMe,
  } = data;

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const isPostOpened = location.pathname.includes(`/post/${postId}`);

  // Mutation to update the post message
  const [updatePostMutation] = useMutation(UPDATE_POST);

  // Define state for form data
  const [formData, setFormData] = useState<Record<string, string>>({
    message: data?.message!,
  });

  // Handle form data change
  const handleFormDataChange = (newFormData: Record<string, string>) => {
    setFormData(newFormData);
  };

  const handleSubmitFunction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Optimistically update the UI with the new message
      const optimisticPost = {
        ...data,
        message: formData.message,
      };
  
      // Update the cache optimistically
      client.writeQuery({
        query: GET_POST_BY_ID,
        variables: { postId: data._id },
        data: {
          post: optimisticPost,
        },
      });
  
      // Perform the actual mutation
      await updatePostMutation({
        variables: {
          input: {
            postId: data._id,
            message: formData.message,
          },
        },
      });
  
      // Handle success, update any relevant UI state
      toast({
        variant: "default",
        title: "Post updated successful",
        description: "You have successfully updated your Post",
      });
    } catch (e: any) {
      // Handle error
      console.error("Error updating post:", e);
      const errorMessage =
        e?.networkError?.result?.errors?.[0]?.message ??
        "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Error while updating",
        description: errorMessage,
      });
    }
  };

  return (
    <Card key={postId} className="bg-secondary">
      <CardHeader className="w-full flex flex-row items-center justify-between">
        <div className="flex items-center gap-base">
          <AvatarLogo image={ownerAvatar ? ownerAvatar : ""} text={ownerName} />
          <Button
            variant="ghost"
            className={`px-0 ${isPostOpened ? "disabled:opacity-100" : ""}`}
            onClick={() => navigate(`/profile/${ownerId}`)}
          >
            {ownerName}
          </Button>
        </div>
        <div>
          <span className="text-sm mr-3">{timeDifference(createdAt)}</span>
          {showEditOptions && isMyPost && (
            <EditDialog
              buttonName="Edit"
              dialogTitle="Edit Post"
              dialogDescription="Update the content of your post"
              formFieldsModelData={[
                {
                  label: "Message",
                  inputType: "textarea",
                  inputId: "message",
                  isRequired: true,
                },
              ]}
              initialValues={formData}
              onFormDataChange={handleFormDataChange}
              handleSubmit={handleSubmitFunction}
            />
          )}
        </div>
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
          {/* button to handle post reaction : like | unlike */}
          <Button
            variant="ghost"
            className="px-0"
            onClick={isLikedByMe ? onUnlikePost : onLikePost}
          >
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
