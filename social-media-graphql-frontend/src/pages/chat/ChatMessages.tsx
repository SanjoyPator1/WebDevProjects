import { FC, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ChatMessageWithNotificationTypeModel, FriendModel } from "../../models/component.model";
import { GET_MESSAGES_BY_RECEIVER_ID } from "../../graphql/queries/chatQueries";
import {
  MARK_MESSAGES_AS_SEEN,
  SEND_MESSAGE,
} from "../../graphql/mutations/chatMutation";
import MessageCard from "../../components/chat/MessageCard";
import TextInputWithButton from "../../components/textInputWithButton/textInputWithButton";
import client from "../../graphql/apolloClient";
import AvatarLogo from "../../components/avatar/AvatarLogo";
import { GET_USERS_WITH_CHATS } from "../../graphql/queries/userQueries";

interface ChatMessagesProps {
  selectedChatUserId: string;
  selectedChatUserName: string;
  selectedChatUserAvatar: string;
  loggedInUserId: string;
}

const ChatMessages: FC<ChatMessagesProps> = ({
  selectedChatUserId,
  selectedChatUserName,
  selectedChatUserAvatar,
  loggedInUserId,
}) => {
  const { loading, error, data } = useQuery(GET_MESSAGES_BY_RECEIVER_ID, {
    variables: { userId: selectedChatUserId },
    skip: !selectedChatUserId,
  });

  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  const [markMessagesAsSeenMutation] = useMutation(MARK_MESSAGES_AS_SEEN);

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Function to update the cache with numberOfUnseenMessages set to 0 for the selected user
  const updateCacheForSelectedUser = () => {
    const cachedData = client.readQuery({
      query: GET_USERS_WITH_CHATS,
    });

    if (cachedData && cachedData.getUsersWithChats) {
      const updatedUsersWithChats = cachedData.getUsersWithChats.map((user: FriendModel) => {
        if (user._id === selectedChatUserId) {
          return {
            ...user,
            numberOfUnseenMessages: 0,
          };
        }
        return user;
      });

      client.writeQuery({
        query: GET_USERS_WITH_CHATS,
        data: {
          getUsersWithChats: updatedUsersWithChats,
        },
      });
    }
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  const sendMessage = async (inputMessage: string) => {
    try {
      const result = await sendMessageMutation({
        variables: {
          input: {
            receiverId: selectedChatUserId,
            message: inputMessage,
          },
        },
      });

      if (result.data && result.data.sendMessage) {
        const newMessage = result.data.sendMessage;

        const existingMessageData = client.readQuery({
          query: GET_MESSAGES_BY_RECEIVER_ID,
          variables: { userId: selectedChatUserId },
        }).getMessages;

        client.writeQuery({
          query: GET_MESSAGES_BY_RECEIVER_ID,
          variables: { userId: selectedChatUserId },
          data: {
            getMessages: [newMessage, ...existingMessageData],
          },
        });

        scrollToBottom();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const markMessagesAsSeen = async () => {
    if (!loading && data && data.getMessages) {
      const unseenMessageIds = data.getMessages
        .filter(
          (message: ChatMessageWithNotificationTypeModel) =>
            !message.seen && message.receiver?._id === loggedInUserId
        )
        .map((message: ChatMessageWithNotificationTypeModel) => message._id);

      if (unseenMessageIds.length > 0) {
        try {
          const markedSeenMessagesResult = await markMessagesAsSeenMutation({
            variables: {
              input: { messageIds: unseenMessageIds },
            },
          });

          if (markedSeenMessagesResult.data) {
            // Mark messages as seen in the cache
            const markedMessageIds =
              markedSeenMessagesResult.data.markAsSeen.map(
                (message: ChatMessageWithNotificationTypeModel) => message._id
              );

            client.writeQuery({
              query: GET_MESSAGES_BY_RECEIVER_ID,
              variables: { userId: selectedChatUserId },
              data: {
                getMessages: data.getMessages.map(
                  (message: ChatMessageWithNotificationTypeModel) => ({
                    ...message,
                    seen:
                      markedMessageIds.includes(message._id) || message.seen,
                  })
                ),
              },
            });
          }
        } catch (error) {
          console.error("Error marking messages as seen:", error);
        }
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
    markMessagesAsSeen();
    updateCacheForSelectedUser();
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-base-container md:p-md-container shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] relative">
        <AvatarLogo
          image={selectedChatUserAvatar}
          text={selectedChatUserName}
          size="small"
        />
        <h3 className="ml-4">{selectedChatUserName}</h3>
      </div>
      <div
        className="flex-1 flex flex-col-reverse overflow-y-scroll scroll-smooth"
        ref={messageContainerRef}
      >
        {data?.getMessages.length === 0 && (
          // If there are no messages, show a message indicating no conversation
          <div className="w-full p-md-container flex justify-center items-center">
            <p className="opacity-50">No conversation till now</p>
          </div>
        )}
        {data.getMessages.map(
          (message: ChatMessageWithNotificationTypeModel) => (
            <MessageCard
              key={message._id}
              message={message}
              selectedChatUserId={selectedChatUserId}
            />
          )
        )}
      </div>
      <div className="pt-3">
        <TextInputWithButton
          placeholder="type new message here..."
          onClick={(message) => sendMessage(message)}
          size="small"
        />
      </div>
    </div>
  );
};

export default ChatMessages;
