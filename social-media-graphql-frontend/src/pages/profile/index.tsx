import TextInputWithButton from "../../components/textInputWithButton/textInputWithButton";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useRecoilState } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import { useParams } from "react-router-dom";
import ProfileInfoCard from "../../components/profileInfoCard/profileInfoCard";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "../../graphql/queries/userQueries";
import { PostModel } from "../../models/component.model";
import PostCard from "../../components/postCard";
import { handleCreatePostFromProfile, handleLikePostFromProfile, handleUnlikePostFromProfile } from "../../services/postActions";
import { CREATE_POST, LIKE_POST, UNLIKE_POST } from "../../graphql/mutations/postMutations";

const Profile = () => {
  const [userData] = useRecoilState(userDataState);
  const { id } = useParams();

  // Compare the current path id with userData._id to determine if it's the user's own profile
  const isOwnProfile = userData._id === id;

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

  if (loadingUserDataGraphQl) {
    return <div>Loading...</div>;
  }

  //create a post using mutation
  const handleCreatePostWrapper = async (text: string) => {
    try {
      await handleCreatePostFromProfile(createPost, text, GET_USER_BY_ID, "array",{ userId: id }  );
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error creating post:", error);
    }
  };

  // Function to handle liking a post
  const handleLikePostWrapper = async (postId: string) => {
    try {
      await handleLikePostFromProfile(likePost, postId, GET_USER_BY_ID, "array",{ userId: id } );
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error liking post:", error);
    }
  };

  // Function to handle unlike a post
  const handleUnlikePostWrapper = async (postId: string) => {
    try {
      await handleUnlikePostFromProfile(unlikePost, postId, GET_USER_BY_ID, "array",{ userId: id });
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error unliking post:", error);
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
            isOwnProfile={isOwnProfile}
            displayType="full"
          />
        </div>
      )}
      {/* Post input */}
      <div className={`mb-lg ${!isOwnProfile && "hidden"}`}>
        <TextInputWithButton
          buttonText="Post"
          placeholder="Write your post here..."
          onPost={(text) => handleCreatePostWrapper(text)}
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

// {fakePostData.map((postData) => (
//   <div className="mb-lg">
//     {/* <PostCard key={postData.postId} data={postData} /> */}
//   </div>
// ))}
