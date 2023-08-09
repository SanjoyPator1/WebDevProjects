import React, { useEffect, useRef, useState } from "react";
import { MdNotifications } from "react-icons/md";
import { useRecoilValue } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import NotificationSheet from "./NotificationSheet";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  GET_NOTIFICATIONS,
  NEW_NOTIFICATION,
} from "../../graphql/queries/postQueries";
import { NotificationModel } from "../../models/component.model";
import { MARK_NOTIFICATIONS_SEEN } from "../../graphql/mutations/postMutations";
import client from "../../graphql/apolloClient";

const NotificationsDropdown: React.FC = () => {
  const userData = useRecoilValue(userDataState);
  const [showNotifications, setShowNotifications] = useState(false);
  const [numberOfNewNotifications, setNumberOfNewNotifications] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useQuery(GET_NOTIFICATIONS, {
    variables: { targetId: userData._id },
  });

  const [markNotificationsAsSeen] = useMutation(MARK_NOTIFICATIONS_SEEN);

  // const { data: newNotificationData } = useSubscription(NEW_NOTIFICATION, {
  //   variables: { userId: userData._id },
  //   onSubscriptionData: ({ subscriptionData }) => {
  //     console.log({ subscriptionData });
  //     if (subscriptionData.data) {
  //       const newNotification = subscriptionData.data.newNotification;
  //       console.log({ newNotification });
  //       subscribeToMore({
  //         document: GET_NOTIFICATIONS,
  //         variables: { targetId: userData._id },
  //         updateQuery: (prev, { subscriptionData }) => {
  //           if (!subscriptionData.data) return prev;
  //           return {
  //             ...prev,
  //             notifications: [newNotification, ...prev.notifications],
  //           };
  //         },
  //       });
  //     }
  //   },
  // });

  const { data: newNotificationData } = useSubscription(NEW_NOTIFICATION, {
    variables: { userId: userData._id },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data) {
        const newNotification = subscriptionData.data.newNotification;

        const prevDataCache = client.readQuery({
          query: GET_NOTIFICATIONS,
          variables: { targetId: userData._id },
        });

        const prevData = prevDataCache.notifications;

        // Update the initial notifications with the new notification
        const updatedInitialNotifications = [newNotification, ...prevData];

        // Update the cache with the new data
        client.writeQuery({
          query: GET_NOTIFICATIONS,
          data: { notifications: updatedInitialNotifications },
          variables: { targetId: userData._id },
        });
      }
    },
  });

  if (error) {
    console.log({ error });
  }

  //handle on bell click
  const handleBellClick = async (isOutsideClick: boolean) => {
    const prevShowNotificationValue = showNotifications;
    //toggle the open state of the notification list
    //when the notification list is already open and user clicks outside
    if (isOutsideClick && prevShowNotificationValue) {
      setShowNotifications((prev) => !prev);
    }
    //button click -> revert the state no matter what
    if (!isOutsideClick) {
      setShowNotifications((prev) => !prev);
    }
    //mark as seen true only when closing the notification list
    if (prevShowNotificationValue === true) {
      //set the number of new notifications to 0 while closing
      setNumberOfNewNotifications(0);

      //mutation MARK_NOTIFICATION_SEEN
      const unseenNotificationIds = data?.notifications
        .filter((notification: NotificationModel) => !notification.seen)
        .map((notification: NotificationModel) => notification._id);

      //if unseenNotification are present -> change seen to true : mutate
      if (unseenNotificationIds.length > 0) {
        // Call the mutation to mark notifications as seen
        await markNotificationsAsSeen({
          variables: {
            notificationIds: unseenNotificationIds,
          },
        });

        // Manually update cache for new notifications after subscription
        client.writeQuery({
          query: GET_NOTIFICATIONS, // Replace with your actual query
          data: {
            notifications: data?.notifications.map(
              (notification: NotificationModel) => {
                if (unseenNotificationIds.includes(notification._id)) {
                  return {
                    ...notification,
                    seen: true,
                  };
                }
                return notification;
              }
            ),
          },
        });

        // Manually update cache for new notifications after subscription
        client.cache.modify({
          fields: {
            notifications(existingNotifications = []) {
              const updatedNotifications = existingNotifications.map(
                (notification: NotificationModel) => {
                  if (unseenNotificationIds.includes(notification._id)) {
                    return {
                      ...notification,
                      seen: true,
                    };
                  }
                  return notification;
                }
              );
              return updatedNotifications;
            },
          },
        });
      }
    }
  };

  useEffect(() => {
    // Calculate the number of new notifications with the seen value as false
    const newNotificationsCount = (data?.notifications || []).filter(
      (notification: NotificationModel) => !notification.seen
    ).length;

    // Set the number of new notifications
    setNumberOfNewNotifications(newNotificationsCount);
  }, [newNotificationData?.notifications, data?.notifications]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        handleBellClick(true);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [handleBellClick, menuRef]);

  return (
    <div className="px-4 py-2 relative notification-dropdown" ref={menuRef}>
      <div
        onClick={() => handleBellClick(false)}
        className="relative cursor-pointer"
      >
        <MdNotifications className="h-6 w-5 md:h-6 md:w-6" />
        {numberOfNewNotifications > 0 && (
          <div className="bg-destructive rounded-full h-4 w-4 text-xs text-white text-center absolute -top-1 -right-1">
            {numberOfNewNotifications}
          </div>
        )}
      </div>
      {showNotifications && (
        <div className="absolute right-0 bottom-100 border rounded-md bg-primary-foreground mt-3 md:mt-6">
          {!loading && (
            <NotificationSheet notificationData={data?.notifications || []} />
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
