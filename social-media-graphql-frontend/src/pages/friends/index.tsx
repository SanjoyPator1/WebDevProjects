import PendingFriendRequest from "../pendingFriendRequest/PendingFriendRequest";
import SuggestedFriends from "../suggestedFriends/SuggestedFriends";

const Friends = () => {
  return (
    <div className="flex flex-col h-full gap-sm overflow-y-auto">
      {/* display pending friend requests */}
      <div className="h-72 border">
        <PendingFriendRequest />
      </div>
      {/* display suggested friends */}
      <div className="h-fit">
        <SuggestedFriends/>
      </div>
    </div>
  );
};

export default Friends;
