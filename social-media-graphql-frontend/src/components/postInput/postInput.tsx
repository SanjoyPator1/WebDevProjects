import React from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRecoilState } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import AvatarLogo from "../avatar/AvatarLogo";
import { IoMdSend } from "react-icons/io";

const PostInput = () => {
  const [userData] = useRecoilState(userDataState);

  return (
    <div className="w-full px-md py-lg border rounded-md flex flex-wrap flex-col md:flex-row gap-base">
      <div className="flex items-center flex-1 w-full gap-base">
        {/* avatar */}
        <AvatarLogo image={userData.avatar} text={userData.name} />

        {/* postInput */}
        <Textarea
          placeholder="Write your post here..."
          className="resize-none flex-1"
        />
      </div>
      {/* post button */}
      <div className="w-full md:w-fit flex justify-end items-end">
        <Button type="submit">
          Post
          <IoMdSend className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PostInput;
