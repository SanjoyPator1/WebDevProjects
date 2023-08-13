import { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { useQuery, useSubscription } from "@apollo/client";
import { useRecoilValue } from "recoil";
import { FIND_FRIENDS } from "../../graphql/queries/userQueries";
import { userDataState } from "../../lib/recoil/atom";
import AvatarLogo from "../../components/avatar/AvatarLogo";
import { useHorizontalScroll } from "../../lib/customHooks/HorizontalScroll";
import { SearchFriendsCommand } from "../../components/SearchFriendsCommand/SearchFriendsCommand";
import ChatMessages from "./ChatMessages";
import { NEW_MESSAGE_CHAT_SUBSCRIPTION, SEEN_MESSAGE_CHAT_SUBSCRIPTION } from "../../graphql/subscription/chatSubscription"; // Update with the correct import
import client from "../../graphql/apolloClient";
import { GET_MESSAGES_BY_RECEIVER_ID } from "../../graphql/queries/chatQueries";
import { ChatMessageModel, ChatMessageWithNotificationTypeModel } from "../../models/component.model";

interface FriendModel {
  _id: string;
  name: string;
  avatar: string;
}

const Chat = () => {
  const userData = useRecoilValue(userDataState);
  const loggedInUserId = userData?._id?.toString(); // Using optional chaining
  const scrollRef = useHorizontalScroll();

  const [openSearchFriends, setOpenSearchFriends] = useState(false);
  const [selectedChatUserId, setSelectedChatUserId] = useState<FriendModel | null>(
    null
  );

  // Use the useQuery hook to fetch friends
  const { loading, error, data } = useQuery(FIND_FRIENDS, {
    variables: { userId: loggedInUserId },
    skip: !loggedInUserId, // Skip the query if userId is not available
  });

  // Subscription for new messages
  useSubscription(
    NEW_MESSAGE_CHAT_SUBSCRIPTION,
    {
      variables: { receiverId: loggedInUserId },
      onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData.data) {
          const newMessage = subscriptionData.data.newMessageChatSubscription;
          const senderUserId = newMessage.sender._id;

          const existingMessageData = client.readQuery({
            query: GET_MESSAGES_BY_RECEIVER_ID,
            variables: { userId: senderUserId },
          }).getMessages;

          client.writeQuery({
            query: GET_MESSAGES_BY_RECEIVER_ID,
            variables: { userId: senderUserId },
            data: {
              getMessages: [newMessage, ...existingMessageData],
            },
          });
        }
      },
    }
  );

  //subscription for seen messages
  useSubscription(SEEN_MESSAGE_CHAT_SUBSCRIPTION, {
    variables: { receiverId: loggedInUserId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data) {
        // Extract the array of seen messages from the subscription data
        const seenMessages: ChatMessageModel[] = subscriptionData.data.seenMessageChatSubscription;

        const receiverUserId =subscriptionData.data.seenMessageChatSubscription[0].receiver._id;
  
        // Read the existing message data from the cache
        const existingMessageData = client.readQuery({
          query: GET_MESSAGES_BY_RECEIVER_ID,
          variables: { userId: receiverUserId },
        });
  
        // Create a map of message IDs for easier lookup
        const seenMessageIds = new Set(seenMessages.map(message => message._id));

        // Update the 'seen' status for messages in the cache
        const updatedMessages = existingMessageData.getMessages.map(
          (message: ChatMessageWithNotificationTypeModel) => ({
            ...message,
            seen: seenMessageIds.has(message._id) || message.seen,
          })
        );
  
        // Write the updated message data back to the cache
        client.writeQuery({
          query: GET_MESSAGES_BY_RECEIVER_ID,
          variables: { userId: receiverUserId },
          data: {
            getMessages: updatedMessages,
          },
        });
      }
    },
  });
  

  useEffect(() => {
    if (!loading && data && data.findFriends.length > 0) {
      setSelectedChatUserId({
        _id: data.findFriends[0]._id,
        name: data.findFriends[0].name,
        avatar: data.findFriends[0].avatar
      });
    }
  }, [loading, data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const friends: FriendModel[] = data?.findFriends || [];

  return (
    <div className="h-full flex flex-col gap-base overflow-hidden">
      <div className="h-[4%] flex items-center gap-md w-full">
        <h3>Chat</h3>
        <div
          onClick={() => setOpenSearchFriends(true)}
          className="w-4/5 flex items-center border rounded-md p-base-container gap-base bg-white dark:bg-slate-400 dark:text-primary-foreground"
        >
          <BiSearchAlt2 />
          <p className="text-xs">Search Users</p>
        </div>
      </div>
      <SearchFriendsCommand
        open={openSearchFriends}
        setOpen={setOpenSearchFriends}
        friends={friends}
        setSelectedChatUserId={setSelectedChatUserId}
      />

      <div
        ref={scrollRef}
        className="h-[12%] rounded-md p-base-container overflow-x-auto touch-pan-x flex gap-base"
      >
        {friends.map((friend: FriendModel) => (
          <div
            key={friend._id}
            className="flex flex-col items-center p-base-container"
            onClick={() => setSelectedChatUserId({
              _id:friend._id,
              name: friend.name,
              avatar: friend.avatar
            })}
          >
            <AvatarLogo
              size="xs"
              image={friend.avatar}
              text={friend.name}
              selectedUser={selectedChatUserId?._id === friend._id}
            />
            <p className="mt-1 text-xs text-center">{friend.name}</p>
          </div>
        ))}
      </div>
      <div className="h-[81%] border rounded-md flex-1">
        {selectedChatUserId ? (
          <ChatMessages selectedChatUserId={selectedChatUserId._id} selectedChatUserName={selectedChatUserId.name} selectedChatUserAvatar={selectedChatUserId.avatar} loggedInUserId={loggedInUserId}/>
        ) : (
          <p>chat to be loaded!</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
