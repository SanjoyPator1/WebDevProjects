import React from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useRecoilState } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import AvatarLogo from "../avatar/AvatarLogo";
import { IoMdSend } from "react-icons/io";

// Define the props interface for PostInput
interface TextInputWithButtonProps {
  placeholder: string;
  buttonText?: string;
  onClick: (text: string) => void;
  size?: "small" | "medium";
}

const TextInputWithButton: React.FC<TextInputWithButtonProps> = ({
  placeholder,
  buttonText,
  onClick: onPost,
  size = "small",
}) => {
  const [userData] = useRecoilState(userDataState);
  const [postText, setPostText] = React.useState("");

  const handlePost = () => {
    // Call the onPost callback with the postText value
    onPost(postText);
    // Reset the postText to an empty string after posting
    setPostText("");
  };

  return (
    <div
      className={`w-full ${
        size === "small" ? " px-base py-md" : "px-md py-lg"
      }  border rounded-md flex flex-wrap ${
        buttonText && "flex-col"
      }  md:flex-row gap-base bg-secondary text-base`}
    >
      <div className="flex items-center flex-1 gap-base">
        {/* avatar */}
        <AvatarLogo image={userData.avatar} text={userData.name} />

        {/* postInput */}
        <Textarea
          placeholder={placeholder}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          className={`resize-y flex-1 bg--foreground dark:text-input text-base ${
            size === "small" ? "min-h-[50px]" : "min-h-[80px"
          } `}
        />
      </div>
      {/* post button */}
      <div
        className={`${
          buttonText ? "w-full" : "w-fit"
        }   flex justify-end items-end`}
      >
        <Button
          size={!buttonText ? "icon" : "default"}
          className="text-base"
          type="submit"
          onClick={handlePost}
        >
          {buttonText && buttonText}
          <IoMdSend className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TextInputWithButton;
