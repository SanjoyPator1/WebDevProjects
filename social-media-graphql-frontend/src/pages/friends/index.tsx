import { useQuery } from "@apollo/client";
// import ManyUserCard from "../../components/ManyUserScrollAreaModel/ManyUserScrollAreaModel";
import { PENDING_FRIEND_REQUEST } from "../../graphql/queries/userQueries";

const Friends = () => {
  const {
    loading: loadingPendingFriendRequest,
    data: dataPendingFriendRequest,
  } = useQuery(PENDING_FRIEND_REQUEST);

  if (loadingPendingFriendRequest) {
    return <div>Loading...</div>;
  }
  
  !loadingPendingFriendRequest && console.log(dataPendingFriendRequest)

  return (
    <div className="h-full">
      {/* display pending friend requests */}
      <div className="h-[30%]">
        {/* <ManyUserCard dataProp={} /> */}
      </div>
      {/* display suggested friends */}
      <div className="h-[70%]">{/* <ManyUserCard dataProp={} /> */}</div>
    </div>
  );
};

export default Friends;
