import UserModel from "../db/user.model";
import NotificationModel from "../db/notification.model";
import pubsub, { NEW_NOTIFICATION } from "../pubsub";
export const createAndPublishNotification = async (creatorUserId, targetUserId, module, action, linkId) => {
    const [creatorUser, targetUser] = await Promise.all([
        UserModel.findById(creatorUserId),
        UserModel.findById(targetUserId),
    ]);
    const notificationDbData = await NotificationModel.create({
        creatorUserId,
        targetUserId,
        module,
        action,
        linkId,
        seen: false, // Set seen to false initially
    });
    const notificationPayload = {
        _id: notificationDbData._id,
        creatorUser,
        targetUser,
        module,
        action,
        linkId,
        createdAt: notificationDbData.createdAt,
        updatedAt: notificationDbData.updatedAt,
        seen: notificationDbData.seen, // Use the seen value from the created notification
    };
    pubsub.publish(NEW_NOTIFICATION, {
        newNotification: notificationPayload,
    });
};
