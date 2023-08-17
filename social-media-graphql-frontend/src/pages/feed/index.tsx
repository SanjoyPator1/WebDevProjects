import PostCard from "../../components/postCard";
import TextInputWithButton from "../../components/textInputWithButton/textInputWithButton";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useMutation, useQuery } from "@apollo/client";
import { GET_FEED } from "../../graphql/queries/postQueries";
import { PostModel } from "../../models/component.model";
import {
  CREATE_POST,
  LIKE_POST,
  UNLIKE_POST,
} from "../../graphql/mutations/postMutations";
import { handleCreatePost, handleLikePost, handleUnlikePost } from "../../services/postActions";
import { useRecoilValue } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
const Feed = () => {

  const loggedInUserData = useRecoilValue(userDataState)

  const { data: feedData, loading: loadingFeed } = useQuery(GET_FEED);
  const [createPost] = useMutation(CREATE_POST);
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);

  // console.log({ feedData });
  // console.log({ loadingFeed });

  //create a post using mutation
  const handleCreatePostWrapper = async (text: string) => {
    try {
      await handleCreatePost(createPost, text, GET_FEED, "feed", "array",loggedInUserData._id, loggedInUserData.name, loggedInUserData.avatar  );
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error creating post:", error);
    }
  };

  // Function to handle liking a post
  const handleLikePostWrapper = async (postId: string) => {
    try {
      await handleLikePost(likePost, postId, GET_FEED, "feed", "array" );
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error liking post:", error);
    }
  };

  // Function to handle unlike a post
  const handleUnlikePostWrapper = async (postId: string) => {
    try {
      await handleUnlikePost(unlikePost, postId, GET_FEED, "feed", "array");
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error unliking post:", error);
    }
  };

  if (loadingFeed) {
    return <div>Loading...</div>;
  }



  return (
    <ScrollArea className="h-full relative">
      {/* Post input */}
      <div className="mb-lg">
        <TextInputWithButton
          buttonText="Post"
          placeholder="Write your post here..."
          onClick={(text) => handleCreatePostWrapper(text)}
          size="medium"
        />
      </div>
      {/* all the other posts */}
      {!loadingFeed &&
        feedData.feed.map((postData: PostModel) => (
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

export default Feed;
