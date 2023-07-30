import React from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useRecoilState } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import AvatarLogo from "../avatar/AvatarLogo";
import { IoMdSend } from "react-icons/io";

// Define the props interface for PostInput
interface TextInputWithButtonProps  {
  placeholder: string;
  buttonText: string;
  onPost: (text: string) => void;
}

const TextInputWithButton: React.FC<TextInputWithButtonProps > = ({ placeholder, buttonText, onPost }) => {
  const [userData] = useRecoilState(userDataState);
  const [postText, setPostText] = React.useState("");

  const handlePost = () => {
    // Call the onPost callback with the postText value
    onPost(postText);
    // Reset the postText to an empty string after posting
    setPostText("");
  };

  return (
    <div className="w-full px-md py-lg border rounded-md flex flex-wrap flex-col md:flex-row gap-base bg-secondary">
      <div className="flex items-center flex-1 w-full gap-base">
        {/* avatar */}
        <AvatarLogo image={userData.avatar} text={userData.name} />

        {/* postInput */}
        <Textarea
          placeholder={placeholder}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          className="resize-none flex-1 bg--foreground dark:text-input"
        />
      </div>
      {/* post button */}
      <div className="w-full md:w-fit flex justify-end items-end">
        <Button type="submit" onClick={handlePost}>
          {buttonText}
          <IoMdSend className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TextInputWithButton;
