import { useMutation, useQuery } from "@apollo/client";
// import ManyUserCard from "../../components/ManyUserScrollAreaModel/ManyUserScrollAreaModel";
import { PENDING_FRIEND_REQUEST } from "../../graphql/queries/userQueries";
import { ScrollArea } from "../../components/ui/scroll-area";
import { UserModel } from "../../models/component.model";
import ProfileInfoCard from "../../components/profileInfoCard/profileInfoCard";
import { useToast } from "../../components/ui/use-toast";
import { RESPOND_TO_FRIEND_REQUEST, SEND_FRIEND_REQUEST } from "../../graphql/mutations/userMutations";
import client from "../../graphql/apolloClient";
const PendingFriendRequest = () => {
  const { toast } = useToast();
  const {
    loading: loadingPendingFriendRequest,
    data: dataPendingFriendRequest,
  } = useQuery(PENDING_FRIEND_REQUEST);
  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST);
  const [respondToFriendRequest] = useMutation(RESPOND_TO_FRIEND_REQUEST);

  if (loadingPendingFriendRequest) {
    return <div>Loading...</div>;
  }

  // Function to handle sending a friend request
  const handleSendFriendRequest = async (receiverId: string) => {
    console.log("sendFriendRequest to "+ receiverId)
    try {
      const { data } = await sendFriendRequest({
        variables: { receiverId: receiverId },
      });
      if (data && data.sendFriendRequest) {
        // Update the cache after sending the friend request
        const friendStatus = "pendingByUser"; // Friend status after sending the request
        const friendId = data.sendFriendRequest.id; // Get the friendId from the mutation response

        console.log({friendStatus})
        console.log({friendId})

        client.writeQuery({
          query: PENDING_FRIEND_REQUEST,
          data: {
            pendingFriendRequests: dataPendingFriendRequest.pendingFriendRequests.map(
              (profile: UserModel) => {
                if (profile._id === receiverId) {
                  return {
                    ...profile,
                    friendStatus: friendStatus,
                    friendId: friendId,
                  };
                }
                return profile;
              }
            ),
          },
        });

        // Show toast of successful friend request sent
        toast({
          variant: "default",
          title: "Friend request sent",
          description:
            "Wait till the other user accepts or cancels the request",
        });
      }
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error sending friend request:", error);
    }
  };

  // Function to handle responding to a friend request
  const handleRespondToFriendRequest = async (
    status: string,
    friendRequestId: string
  ) => {
    try {
      // status should be either 'accepted' or 'cancelled'
      const { data } = await respondToFriendRequest({
        variables: { friendRequestId, status },
      });

      if (data && data.respondToFriendRequest) {
        // Update the cache after responding to the friend request
        const newFriendStatus = status === "accepted" ? "friend" : "notFriend";
        console.log({newFriendStatus})

        client.writeQuery({
          query: PENDING_FRIEND_REQUEST,
          data: {
            pendingFriendRequests:  dataPendingFriendRequest.pendingFriendRequests.map(
              (profile: UserModel) => {
                if (profile._id === data.respondToFriendRequest.senderId) {
                  console.log("updating pending friend status for "+ data.respondToFriendRequest.senderId)
                  return {
                    ...profile,
                    friendStatus: newFriendStatus,
                  };
                }
                return profile;
              }
            ),
          },
        });

        // Show toast of successful friend request accepted or cancelled
        const toastTitle =
          status === "accepted"
            ? "Friend request accepted"
            : "Friend request cancelled";
        toast({
          variant: "default",
          title: toastTitle,
          description:
            status === "accepted"
              ? "Congrats! you both are friends now"
              : "Friendship is now cancelled successfully",
        });
      }
    } catch (error) {
      // Handle the error here (e.g., show a toast message)
      console.error("Error responding to friend request:", error);
    }
  };

  !loadingPendingFriendRequest && console.log(dataPendingFriendRequest);
  return (
    <div className="h-full flex flex-col gap-md">
      <h3>Pending friend request</h3>
      <ScrollArea className="h-full">
        {!loadingPendingFriendRequest &&
          dataPendingFriendRequest.pendingFriendRequests.length > 0 ? (
            dataPendingFriendRequest.pendingFriendRequests.map((profiles: UserModel) => (
              <div key={profiles._id} className="mb-md md:mb-lg">
                <ProfileInfoCard
                  profileId={profiles._id}
                  avatar={profiles.avatar}
                  name={profiles.name}
                  bio={profiles.bio}
                  friendStatus={profiles.friendStatus}
                  friendId={profiles.friendId}
                  onSendFriendRequest={handleSendFriendRequest}
                  onRespondToFriendRequest={handleRespondToFriendRequest}
                  displayType="short"
                />
              </div>
            ))
          ) : (
            <div>No pending friend requests</div>
          )}
      </ScrollArea>
    </div>
  );
};

export default PendingFriendRequest;
