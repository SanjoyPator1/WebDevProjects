import { useMutation, useQuery } from "@apollo/client";
// import ManyUserCard from "../../components/ManyUserScrollAreaModel/ManyUserScrollAreaModel";
import { SUGGESTED_FRIENDS } from "../../graphql/queries/userQueries";
import { UserModel } from "../../models/component.model";
import ProfileInfoCard from "../../components/profileInfoCard/profileInfoCard";
import { useToast } from "../../components/ui/use-toast";
import {
  RESPOND_TO_FRIEND_REQUEST,
  SEND_FRIEND_REQUEST,
} from "../../graphql/mutations/userMutations";
import client from "../../graphql/apolloClient";

const SuggestedFriends = () => {
  const { toast } = useToast();
  const { loading: loadingSuggestedFriends, data: dataSuggestedFriends } =
    useQuery(SUGGESTED_FRIENDS);
  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST);
  const [respondToFriendRequest] = useMutation(RESPOND_TO_FRIEND_REQUEST);

  // Function to handle sending a friend request
  const handleSendFriendRequest = async (receiverId: string) => {
    console.log("sendFriendRequest to " + receiverId);
    try {
      const { data } = await sendFriendRequest({
        variables: { receiverId: receiverId },
      });
      if (data && data.sendFriendRequest) {
        // Update the cache after sending the friend request
        const friendStatus = "pendingByUser"; // Friend status after sending the request
        const friendId = data.sendFriendRequest.id; // Get the friendId from the mutation response

        console.log({ friendStatus });
        console.log({ friendId });

        client.writeQuery({
          query: SUGGESTED_FRIENDS,
          data: {
            suggestedFriends: dataSuggestedFriends.suggestedFriends.map(
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

        client.writeQuery({
          query: SUGGESTED_FRIENDS,
          data: {
            suggestedFriends: dataSuggestedFriends.suggestedFriends.map(
              (profile: UserModel) => {
                if (profile._id === data.respondToFriendRequest.receiverId) {
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

  !loadingSuggestedFriends && console.log(dataSuggestedFriends);
  return (
    <div className="h-full  flex flex-col gap-base">
      <h3>Suggested Friends</h3>
      {!loadingSuggestedFriends &&
        dataSuggestedFriends.suggestedFriends.map((profiles: UserModel) => {
          return (
            <div key={profiles._id} className="">
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
          );
        })}
      {!loadingSuggestedFriends &&
        dataSuggestedFriends.suggestedFriends.length === 0 && (
          <div>No suggested friend</div>
        )}
    </div>
  );
};

export default SuggestedFriends;
