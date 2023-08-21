import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "../../lib/helperFunction";

interface AvatarLogoModel {
  image: string;
  text?: string;
  size?: "xs" | "small" | "medium";
  selectedUser?: boolean;
  showNumberOfNewMessages?: boolean;
  numberOfNewMessages? : number;
  className?: string;
}

const AvatarLogo: FC<AvatarLogoModel> = ({
  image,
  text,
  size = "small",
  selectedUser = false,
  showNumberOfNewMessages= false,
  numberOfNewMessages,
  className = "", 
}) => {

  let sizeClass = "w-11 h-11";
  switch (size) {
    case "xs":
      sizeClass = "w-6 h-6";
      break;
    case "small":
      sizeClass = `${selectedUser ? "w-10 h-10" : "w-9 h-9"}`;
      break;
    case "medium":
      sizeClass = "w-14 h-14";
      break;
  }

  // Build the avatarClassName with the sizeClass and gradient-border classes inline
  const avatarClassName = `${sizeClass} relative ${
    selectedUser
      ? "border-5 p-1 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
      : ""
  } ${className}`;
  
  let toShowNumberOfMessages = false;
  if(showNumberOfNewMessages){
    if(numberOfNewMessages){
      toShowNumberOfMessages = true
    }
  }

  return (
    <div className={avatarClassName}>
      <Avatar className="h-full w-full aspect-square">
        <AvatarImage className="object-cover" src={image} />
        <AvatarFallback className="bg-primary text-input">
          {text ? getInitials(text) : "U"}
        </AvatarFallback>
      </Avatar>
      { toShowNumberOfMessages && numberOfNewMessages && (
        <div className="bg-destructive rounded-full h-4 w-4 text-xs text-white absolute -top-1 -right-1 text-center flex justify-center items-center">
          <p className=" text-xs">{numberOfNewMessages.toString()}</p>
        </div>
      )}
    </div>
  );
};

export default AvatarLogo;
