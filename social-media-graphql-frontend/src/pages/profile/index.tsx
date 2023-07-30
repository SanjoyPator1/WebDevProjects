import React from "react";
import PostCard from "../../components/postCard";
import TextInputWithButton from "../../components/textInputWithButton/textInputWithButton";
import { fakePostData, fakeProfileInfoData } from "../../lib/fakeData";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useRecoilState } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import { useParams, useNavigate } from "react-router-dom";
import ProfileInfoCard from "../../components/profileInfoCard/profileInfoCard";

const Profile = () => {
  const [userData] = useRecoilState(userDataState);
  const navigate = useNavigate();
  const { id } = useParams();

  // Compare the current path id with userData._id to determine if it's the user's own profile
  const isOwnProfile = userData._id === id;

  return (
    <ScrollArea className="h-full relative">
      {/* profile info */}
      <div className="mb-lg">
        <ProfileInfoCard
          avatar={fakeProfileInfoData[0].avatar}
          name={fakeProfileInfoData[0].name}
          friendStatus={fakeProfileInfoData[0].friendStatus}
          bio={fakeProfileInfoData[0].bio}
          isOwnProfile={isOwnProfile}
          displayType="full"
        />
      </div>
      {/* Post input */}
      <div className={`mb-lg ${!isOwnProfile && "hidden"}`}>
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

export default Profile;
