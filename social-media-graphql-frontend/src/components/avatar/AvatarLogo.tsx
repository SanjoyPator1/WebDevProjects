import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "../../lib/helperFunction";

interface AvatarLogoModel {
  image: string;
  text?: string;
  size?: "xs" | "small" | "medium";
  selectedUser?: boolean;
}

const AvatarLogo: FC<AvatarLogoModel> = ({
  image,
  text,
  size = "small",
  selectedUser = false,
}) => {
  let sizeClass = "w-11 h-11";
  switch (size) {
    case "xs":
      sizeClass = "w-10 h-10";
      break;
    case "small":
      sizeClass = "w-11 h-11";
      break;
    case "medium":
      sizeClass = "w-20 h-20";
      break;
  }

  // Build the avatarClassName with the sizeClass and gradient-border classes inline
  const avatarClassName = `${sizeClass} ${
    selectedUser
      ? "border-5 p-1 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
      : ""
  }`;

  return (
    <div className={avatarClassName}>
        <Avatar className="h-full w-full">
          <AvatarImage className="object-cover" src={image} />
          <AvatarFallback className="bg-primary text-input">
            {text ? getInitials(text) : "U"}
          </AvatarFallback>
        </Avatar>
    </div>
  );
};

export default AvatarLogo;
