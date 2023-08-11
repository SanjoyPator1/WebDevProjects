import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { useQuery } from "@apollo/client";
import { useRecoilValue } from "recoil"; // Import useRecoilValue
import { FIND_FRIENDS } from "../../graphql/queries/userQueries";
import { userDataState } from "../../lib/recoil/atom";
import AvatarLogo from "../../components/avatar/AvatarLogo";

interface friendModel {
  _id: string;
  name: string;
  avatar: string;
}

const FriendCard : React.FC<{ friend: friendModel }> = ( {friend} ) => (
  <div className="flex flex-col items-center p-base-container">
    <AvatarLogo size="small" image={friend.avatar} text={friend.name} />
    <p className="mt-2 text-xs">{friend.name}</p>
  </div>
);

const Chat = () => {
  // Get the userId from Recoil state
  const userData = useRecoilValue(userDataState);
  const userId = userData._id.toString();

  if(!userData._id.toString()) {
    <p>Loading!</p>
  }
  
  // Use the useQuery hook to fetch friends
  const { loading, error, data } = useQuery(FIND_FRIENDS, {
    variables: { userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const friends = data.findFriends;

  return (
    <div className="h-full flex flex-col gap-base overflow-auto no-scrollbar">
      <h3 className="hidden md:block">Chat</h3>
      <div className="flex items-center border rounded-md p-base-container gap-base bg-primary-foreground">
        <BiSearchAlt2 />
        <input
          type="search"
          placeholder="search user"
          className="flex-1 !outline-none bg-primary-foreground"
        />
      </div>
      <div className="border rounded-md p-base-container overflow-x-auto touch-pan-x flex gap-base">
        {friends.map((friend: friendModel) => (
          <FriendCard key={friend._id} friend={friend} />
        ))}
        {friends.map((friend: friendModel) => (
          <FriendCard key={friend._id} friend={friend} />
        ))}
      </div>
      <div className="border rounded-md flex-1 p-base-container">chat to be loaded!</div>
    </div>
  );
};

export default Chat;
