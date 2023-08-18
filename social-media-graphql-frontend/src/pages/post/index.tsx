import { useParams } from "react-router-dom";
import CommentCard from "../../components/commentCard/CommentCard";
import PostCard from "../../components/postCard";
import TextInputWithButton from "../../components/textInputWithButton/textInputWithButton";
import { useMutation, useQuery } from "@apollo/client";
import { GET_POST_BY_ID } from "../../graphql/queries/postQueries";
import { PostModel } from "../../models/component.model";
import {
  ADD_COMMENT,
  LIKE_POST,
  UNLIKE_POST,
} from "../../graphql/mutations/postMutations";
import {
  handleAddComment,
  handleLikePost,
  handleUnlikePost,
} from "../../services/postActions";
import { useRecoilValue } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import CodeLoading from "../../components/lottie/CodeLoading";

const Post = () => {
  const { id } = useParams<{ id: string }>();
  const loggedInUserData = useRecoilValue(userDataState);
  let isMyPost = false;

  //QUERY
  // Fetch the post data and comments by its ID
  const { data: postData, loading: loadingPost } = useQuery(GET_POST_BY_ID, {
    variables: { postId: id },
  });

  //MUTATIONS
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);

  //add comment mutation
  const [addComment] = useMutation(ADD_COMMENT);

  if (loadingPost) {
    return (
      <div className="w-ful h-full flex flex-col justify-center items-center gap-2">
        <div className="h-[60%]">
          <CodeLoading />
        </div>
        <h1>Loading...</h1>
      </div>
    );
  }

  const post: PostModel = postData.post;

  // Function to handle liking a post
  const handleLikePostWrapper = async () => {
    try {
      await handleLikePost(
        likePost,
        post._id,
        GET_POST_BY_ID,
        "post",
        "single",
        {
          postId: id,
        }
      );
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error liking post:", error);
    }
  };

  // Function to handle unlike a post
  const handleUnlikePostWrapper = async () => {
    try {
      await handleUnlikePost(
        unlikePost,
        post._id,
        GET_POST_BY_ID,
        "post",
        "single"
      );
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error unliking post:", error);
    }
  };

  // Function to handle adding a comment
  const handleAddCommentWrapper = async (commentText: string) => {
    handleAddComment(
      addComment,
      post._id,
      commentText,
      GET_POST_BY_ID,
      "post",
      "single",
      {
        postId: id,
      }
    );
  };

  if (!loadingPost && loggedInUserData) {
    isMyPost = loggedInUserData._id === post.owner._id;
  }

  return (
    <div className="h-full flex flex-col gap-md">
      {/* scrollable div to hold post and comments */}
      <div className="h-full flex flex-col gap-md overflow-auto no-scrollbar relative">
        {/* post card */}
        <PostCard
          data={post}
          onLikePost={handleLikePostWrapper}
          onUnlikePost={handleUnlikePostWrapper}
          showEditOptions={true}
          isMyPost={isMyPost}
        />
        {/* comments */}
        {post.comments.map((commentData) => (
          <CommentCard key={commentData._id} data={commentData} />
        ))}
      </div>
      {/* comment input */}
      <TextInputWithButton
        placeholder="Write your comment here..."
        onClick={(text) => {
          handleAddCommentWrapper(text);
        }}
      />
    </div>
  );
};

export default Post;
