import { FC } from "react";
import { ChatMessageWithNotificationTypeModel } from "../../models/component.model";
import AvatarLogo from "../avatar/AvatarLogo";
import { BiCheckDouble,BiCheck } from "react-icons/bi";
import { formatMessageDateForDisplay } from "../../lib/helperFunction";

interface MessageCardProps {
  message: ChatMessageWithNotificationTypeModel;
  selectedChatUserId: string;
}

const MessageCard: FC<MessageCardProps> = ({ message, selectedChatUserId }) => {
  const isMyMessage = message.receiver._id === selectedChatUserId;

  const cardStyles = `flex flex-col gap-0.5 ml-1 md:ml-2 rounded-lg p-md-container max-w-[90%] md:max-w-[70%] ${
    isMyMessage
      ? "bg-blue-500 text-white dark:bg-blue-800 dark:text-white"
      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  }`;

  // Format createdAt timestamp using date-fns
  const formattedDateTime = formatMessageDateForDisplay(new Date(message.createdAt));

  return (
    <div
      className={`w-full p-base-container md:p-md-container flex ${
        isMyMessage ? "justify-end" : "justify-start"
      }`}
    >
      {!isMyMessage && (
        <AvatarLogo
          size="xs"
          key={message._id}
          image={message.sender.avatar!}
          text={message.sender.name}
        />
      )}
      <div className={cardStyles}>
        <p className="text-sm">{message.message}</p>
        <div className="w-full flex gap-1 justify-end">
          <p className="text-xs opacity-60 pl-6">{formattedDateTime}</p>{" "}
          {isMyMessage && message.seen ? (
              <BiCheckDouble className={`h-4 w-4 md:h-5 md:w-5 opacity-100`} />
            ) : isMyMessage && !message.seen ? (
              <BiCheck className={`h-4 w-4 md:h-5 md:w-5 opacity-40`} />
            ): null}

        </div>
      </div>
    </div>
  );
};

export default MessageCard;
