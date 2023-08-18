import TextInputWithButton from "../../components/textInputWithButton/textInputWithButton";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useParams } from "react-router-dom";
import ProfileInfoCard from "../../components/profileInfoCard/profileInfoCard";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "../../graphql/queries/userQueries";
import { PostModel } from "../../models/component.model";
import PostCard from "../../components/postCard";
import {
  handleCreatePostFromProfile,
  handleLikePostFromProfile,
  handleUnlikePostFromProfile,
} from "../../services/postActions";
import {
  CREATE_POST,
  LIKE_POST,
  UNLIKE_POST,
} from "../../graphql/mutations/postMutations";
import {
  RESPOND_TO_FRIEND_REQUEST,
  SEND_FRIEND_REQUEST,
} from "../../graphql/mutations/userMutations";
import client from "../../graphql/apolloClient";
import { useToast } from "../../components/ui/use-toast";
import { userDataState } from "../../lib/recoil/atom";
import { useRecoilValue } from "recoil";
import CodeLoading from "../../components/lottie/CodeLoading";

const Profile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const loggedInUserData = useRecoilValue(userDataState);

  //graphql query
  const { loading: loadingUserDataGraphQl, data: userDataGraphQl } = useQuery(
    GET_USER_BY_ID,
    {
      variables: { userId: id },
    }
  );
  //GraphQL mutations
  const [createPost] = useMutation(CREATE_POST);
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST);
  const [respondToFriendRequest] = useMutation(RESPOND_TO_FRIEND_REQUEST);

  if (loadingUserDataGraphQl) {
    return (
      <div className="w-ful h-full flex flex-col justify-center items-center gap-2">
        <div className="h-[60%]">
          <CodeLoading />
        </div>
        <h1>Loading...</h1>
      </div>
    );
  }

  //create a post using mutation
  const handleCreatePostWrapper = async (text: string) => {
    try {
      await handleCreatePostFromProfile(
        createPost,
        text,
        GET_USER_BY_ID,
        "array",
        loggedInUserData._id,
        loggedInUserData.name,
        loggedInUserData.avatar,
        { userId: id }
      );
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error creating post:", error);
    }
  };

  // Function to handle liking a post
  const handleLikePostWrapper = async (postId: string) => {
    try {
      await handleLikePostFromProfile(
        likePost,
        postId,
        GET_USER_BY_ID,
        "array",
        { userId: id }
      );
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error liking post:", error);
    }
  };

  // Function to handle unlike a post
  const handleUnlikePostWrapper = async (postId: string) => {
    try {
      await handleUnlikePostFromProfile(
        unlikePost,
        postId,
        GET_USER_BY_ID,
        "array",
        { userId: id }
      );
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error unliking post:", error);
    }
  };

  // Function to handle sending a friend request
  const handleSendFriendRequest = async (receiverId: string) => {
    console.log({ receiverId }); //TODO: remove later or use below
    try {
      const { data } = await sendFriendRequest({
        variables: { receiverId: id },
      });

      if (data && data.sendFriendRequest) {
        // Update the cache after sending the friend request
        client.writeQuery({
          query: GET_USER_BY_ID,
          variables: { userId: id },
          data: {
            findUser: {
              ...userDataGraphQl.findUser,
              friendStatus: "pendingByUser",
              friendId: data?.sendFriendRequest?.id,
            },
          },
        });
        //show toast of successful friend request sent
        toast({
          variant: "default",
          title: "Friend request sent",
          description: `Wait till ${userDataGraphQl.findUser.name} accepts or cancels the request`,
        });
      }
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error sending friend request:", error);
    }
  };

  // Function to handle responding to a friend request
  const handleRespondToFriendRequest = async (
    status: string,
    friendRequestId: string
  ) => {
    try {
      // status should be either 'accepted' or 'cancelled'
      const { data } = await respondToFriendRequest({
        variables: { friendRequestId, status },
      });

      if (data && data.respondToFriendRequest) {
        // Update the cache after responding to the friend request
        const newFriendStatus =
          data.respondToFriendRequest.status === "accepted"
            ? "friend"
            : "notFriend"; // If 'accepted', set as 'friend'; otherwise, cancelled so return notFriend

        if (status === "accepted") {
          //show toast of successful friend request accepted
          toast({
            variant: "default",
            title: "Friend request accepted",
            description: `Congrats! you both are friend now`,
          });
        } else {
          //show toast of successful friend request cancelled
          toast({
            variant: "default",
            title: "Friend request cancelled",
            description: `Friendship is now cancelled successfully`,
          });
        }

        client.writeQuery({
          query: GET_USER_BY_ID,
          variables: { userId: id },
          data: {
            findUser: {
              ...userDataGraphQl.findUser,
              friendStatus: newFriendStatus,
            },
          },
        });
      }
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error responding to friend request:", error);
    }
  };

  return (
    <ScrollArea className="h-full relative">
      {/* profile info */}
      {!loadingUserDataGraphQl && (
        <div className="mb-lg">
          <ProfileInfoCard
            profileId={userDataGraphQl.findUser._id}
            avatar={userDataGraphQl.findUser.avatar}
            name={userDataGraphQl.findUser.name}
            bio={userDataGraphQl.findUser.bio}
            friendStatus={userDataGraphQl.findUser.friendStatus}
            friendId={userDataGraphQl.findUser.friendId}
            onSendFriendRequest={handleSendFriendRequest}
            onRespondToFriendRequest={handleRespondToFriendRequest}
            displayType="full"
            avatarSize="medium"
          />
        </div>
      )}
      {/* Post input */}
      <div
        className={`mb-lg ${
          userDataGraphQl.findUser.friendStatus !== "self" && "hidden"
        }`}
      >
        <TextInputWithButton
          buttonText="Post"
          placeholder="Write your post here..."
          onClick={(text) => handleCreatePostWrapper(text)}
        />
      </div>
      {/* all the posts of this user profile*/}
      {!loadingUserDataGraphQl &&
        userDataGraphQl.findUser.posts.map((postData: PostModel) => (
          <div key={postData._id} className="mb-lg">
            <PostCard
              data={postData}
              onLikePost={() => handleLikePostWrapper(postData._id)}
              onUnlikePost={() => handleUnlikePostWrapper(postData._id)}
            />
          </div>
        ))}
    </ScrollArea>
  );
};

export default Profile;
