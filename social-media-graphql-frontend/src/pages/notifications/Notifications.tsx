import React from "react";
import { MdNotifications } from "react-icons/md";
import { useRecoilValue } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "../../components/ui/navigation-menu";
import NotificationSheet from "./NotificationSheet";
import { useQuery, useSubscription } from "@apollo/client";
import {
  GET_NOTIFICATIONS,
  NEW_NOTIFICATION,
} from "../../graphql/queries/postQueries";

const NotificationsDropdown: React.FC = () => {
  const userData = useRecoilValue(userDataState);

  const { subscribeToMore, data, loading, error } = useQuery(
    GET_NOTIFICATIONS,
    {
      variables: { targetId: userData._id },
    }
  );

  const { data: newNotificationData } = useSubscription(NEW_NOTIFICATION, {
    variables: { userId: userData._id },
    onSubscriptionData: ({ subscriptionData }) => {
      console.log({ subscriptionData });
      if (subscriptionData.data) {
        const newNotification = subscriptionData.data.newNotification;
        console.log({ newNotification });
        subscribeToMore({
          document: GET_NOTIFICATIONS,
          variables: { targetId: userData._id },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            return {
              ...prev,
              notifications: [newNotification, ...prev.notifications],
            };
          },
        });
      }
    },
  });

  if (error) {
    console.log({ error });
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>
        <MdNotifications />
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        {!loading && (
          <NotificationSheet
            notificationData={
              newNotificationData?.notifications || data?.notifications || []
            }
          />
        )}
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default NotificationsDropdown;
