import React, { useState, useEffect } from "react";
import PostCard from "../../components/postCard";
import PostInput from "../../components/postInput/postInput";
import { fakePostData } from "../../lib/fakeData";

const Feed = () => {

  return (
    <div className="min-h-full max-h-screen flex flex-col gap-lg overflow-auto no-scrollbar">
       <PostInput />
      {/* all the other posts */}
      {fakePostData.map((postData) => (
        <PostCard key={postData.postId} data={postData} />
      ))}
    </div>
  );
};

export default Feed;
