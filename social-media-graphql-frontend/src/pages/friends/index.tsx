import PendingFriendRequest from "../pendingFriendRequest/PendingFriendRequest";
import SuggestedFriends from "../suggestedFriends/SuggestedFriends";

const Friends = () => {
  return (
    <div className="flex flex-col h-full gap-sm md:gap-md overflow-y-auto no-scrollbar">
      {/* display pending friend requests */}
      <div
        className="h-fit md:h-72"
      >
        <PendingFriendRequest />
      </div>
      {/* display suggested friends */}
      <div className="h-fit">
        <SuggestedFriends />
      </div>
    </div>
  );
};

export default Friends;
