import React from "react";
import PostCard from "../../components/postCard";
import TextInputWithButton from "../../components/textInputWithButton/textInputWithButton";
import { fakePostData } from "../../lib/fakeData";

const Feed = () => {
  return (
    <div className="h-full flex flex-col gap-lg overflow-auto no-scrollbar relative">
      {/* Post input */}
      <TextInputWithButton
        buttonText="Post"
        placeholder="Write your post here..."
        onPost={(text) => {
          // Logic to handle the post, e.g., sending the post to the server
          console.log("New Post:", text);
        }}
      />
      {/* all the other posts */}
      {fakePostData.map((postData) => (
        <PostCard key={postData.postId} data={postData} />
      ))}
    </div>
  );
};

export default Feed;


