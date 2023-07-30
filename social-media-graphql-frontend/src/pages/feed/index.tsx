import React from "react";
import PostCard from "../../components/postCard";
import TextInputWithButton from "../../components/textInputWithButton/textInputWithButton";
import { fakePostData } from "../../lib/fakeData";
import { ScrollArea } from "../../components/ui/scroll-area";

const Feed = () => {
  return (
    <ScrollArea className="h-full relative">
      {/* Post input */}
      <div className="mb-lg">
        <TextInputWithButton
          buttonText="Post"
          placeholder="Write your post here..."
          onPost={(text) => {
            // Logic to handle the post, e.g., sending the post to the server
            console.log("New Post:", text);
          }}
        />
      </div>
      {/* all the other posts */}
      {fakePostData.map((postData) => (
        <div className="mb-lg">
          <PostCard key={postData.postId} data={postData} />
        </div>
      ))}
    </ScrollArea>
  );
};

export default Feed;
