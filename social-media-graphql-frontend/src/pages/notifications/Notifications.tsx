import React, { useEffect, useState } from "react";
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
import { createSignal } from "../../lib/helperFunction";
import { MARK_NOTIFICATIONS_SEEN } from "../../graphql/mutations/postMutations";
import client from "../../graphql/apolloClient";

//using signal to avoid closure
const { getValue, setValue } = createSignal<boolean>(false);

const NotificationsDropdown: React.FC = () => {
  const userData = useRecoilValue(userDataState);
  const [showNotifications, setShowNotifications] = useState(false);
  const [numberOfNewNotifications, setNumberOfNewNotifications] = useState(0);

  const { data, loading, error } = useQuery(
    GET_NOTIFICATIONS,
    {
      variables: { targetId: userData._id },
    }
  );

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

        console.log({prevDataCache})
        const prevData = prevDataCache.notifications
        console.log({prevData})
  
        // Update the initial notifications with the new notification
        const updatedInitialNotifications = [newNotification, ...prevData];
  
        console.log({updatedInitialNotifications})

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
  const handleBellClick = async () => {
    const prevSignalValue = getValue();
    //toggle the open state of the notification list
    setShowNotifications((prev) => !prev);
    setValue(!prevSignalValue);
    // if(prevNotificationState === true || prevSignalValue === true){
    if (prevSignalValue === true) {
      //set the number of new notifications to 0 while closing
      setNumberOfNewNotifications(0);

      //mutation MARK_NOTIFICATION_SEEN
      const unseenNotificationIds = data?.notifications
        .filter((notification: NotificationModel) => !notification.seen)
        .map((notification: NotificationModel) => notification._id);

      console.log("Unseen Notification IDs:");
      console.log({ unseenNotificationIds });

      //if unseenNotification are present -> change seen to true : mutate
      if (unseenNotificationIds.length > 0) {
        console.log(
          "unseen notifications present so doing mutation to seen:true"
        );
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

    console.log({ newNotificationsCount });

    // Set the number of new notifications
    setNumberOfNewNotifications(newNotificationsCount);
  }, [newNotificationData?.notifications, data?.notifications]);

  // Close the notification list when clicking outside of it
  useEffect(() => {
    const prevSignalValue = getValue();
    const closeNotificationsOnOutsideClick = (event: MouseEvent) => {
      if (!event.target) return;

      const targetElement = event.target as HTMLElement;

      const outsideClick = !targetElement.closest(".notification-dropdown");
      const shouldClose = prevSignalValue !== true;

      if (outsideClick && shouldClose) {
        console.log(
          "closing the notification dropdown without handleBellCLick"
        );
        setShowNotifications(false);
        setValue(!prevSignalValue);
      }

      if (outsideClick && !shouldClose) {
        console.log("calling handle bell click")
        handleBellClick();
      }
    };

    window.addEventListener("click", closeNotificationsOnOutsideClick);

    return () => {
      window.removeEventListener("click", closeNotificationsOnOutsideClick);
    };
  }, []);

  console.log({ notificationData: data?.notifications });

  return (
    <div className="px-4 py-2 relative notification-dropdown">
      <div
        onClick={() => handleBellClick()}
        className="relative cursor-pointer"
      >
        <MdNotifications className="h-6 w-5 md:h-6 md:w-6" />
        {/* {showNotifications.toString()} */}
        {/* {prevSignalValue.toString()} */}
        {numberOfNewNotifications > 0 && (
          <div className="bg-destructive rounded-full h-4 w-4 text-xs text-white text-center absolute -top-1 -right-1">
            {numberOfNewNotifications}
          </div>
        )}
      </div>
      {showNotifications && (
        <div className="absolute right-0 bottom-100 border rounded-md bg-primary-foreground mt-3 md:mt-6">
          {!loading && (
            <NotificationSheet
              notificationData={
                data?.notifications || []
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
