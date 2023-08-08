import { FC } from "react";
import NotificationCard from "../../components/Notifications/NotificationCard";
import { NotificationModel } from "../../models/component.model";
import { ScrollArea } from "../../components/ui/scroll-area";

interface Props {
  notificationData: NotificationModel[];
}

const NotificationSheet: FC<Props> = ({ notificationData }) => {
  return (
    <div className={`flex flex-col items-start p-3 md:w-[350px] lg:w-[450px] ${notificationData.length === 0 ? "h-[20vh]" : "h-[90vh]"}`}>
      <h3 className="mb-3 text-base">Notifications</h3>
      <ScrollArea className="flex-1">
        {notificationData.map((notificationCardData: NotificationModel) => (
          <div className="mb-1 md:mb-2" key={notificationCardData._id}>
            <NotificationCard {...notificationCardData} />
          </div>
        ))}
      </ScrollArea>
      {notificationData.length === 0 && (
        <div>
          <p className="italic">No Notifications!</p>
        </div>
      )}
    </div>
  );
};

export default NotificationSheet;
