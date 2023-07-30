import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "../../lib/helperFunction";

interface AvatarLogoModel {
    image: string;
    text?: string;
    size?: "small" | "medium"
}

const AvatarLogo: FC<AvatarLogoModel> = ({image, text,size="small"}) => {
  const sizeClass = size=="small"? "w-11 h-11" : "w-16 h-16"
  return (
    <Avatar className={sizeClass}>
      <AvatarImage className="object-cover" src={image} />
      <AvatarFallback>{text ? getInitials(text): "U"}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarLogo;
