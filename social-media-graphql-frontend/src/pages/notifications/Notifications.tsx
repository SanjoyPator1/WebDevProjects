import React from "react";
import { MdNotifications } from "react-icons/md";
import { useRecoilValue } from "recoil";
import { userDataState } from "../../lib/recoil/atom";
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger } from "../../components/ui/navigation-menu";
import NotificationSheet from "./NotificationSheet";
import { useQuery } from "@apollo/client";
import { GET_NOTIFICATIONS } from "../../graphql/queries/postQueries";

const NotificationsDropdown: React.FC = () => {

    const userData = useRecoilValue(userDataState);

    const { data, loading, error } = useQuery(GET_NOTIFICATIONS, {
        variables: { targetId: userData._id },
    });

    if(loading){
        <p>Loading...</p>
    }

    if(error){
        console.log({error})
    }
    

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>
        <MdNotifications />
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        {/* Notification sheet*/}
        {!loading && data?.notifications &&
          <NotificationSheet notificationData={data.notifications} />
        }
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default NotificationsDropdown;
