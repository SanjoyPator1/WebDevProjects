import CommentCard from "../../components/commentCard/CommentCard";
import PostCard from "../../components/postCard";
import TextInputWithButton from "../../components/textInputWithButton/textInputWithButton";
import { fakeCommentData, fakePostData } from "../../lib/fakeData";

const Post = () => {
  return (
    <div className="h-full flex flex-col gap-md">
      {/* scrollable div to hold post and comments */}
      <div className="h-full flex flex-col gap-md overflow-auto no-scrollbar relative">
        {/* post card */}
        <PostCard data={fakePostData[0]} />
        {/* comments */}
        {fakeCommentData.map((commentData) => (
        <CommentCard key={commentData.data.commentId} data={commentData.data} />
      ))}
      </div>
      {/* comment input */}
      <TextInputWithButton
        placeholder="Write your comment here..."
        buttonText="Comment"
        onPost={(text) => {
          // Logic to handle the comment, e.g., sending the comment to the server
          console.log("New Comment:", text);
        }}
      />
    </div>
  );
};

export default Post;
