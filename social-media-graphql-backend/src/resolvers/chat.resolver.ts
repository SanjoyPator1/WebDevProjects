import { withFilter } from "graphql-subscriptions";
import ChatModel from "../db/chat.model";
import UserModel from "../db/user.model";
import pubsub, { NEW_MESSAGE } from "../pubsub";
import throwCustomError, { ErrorTypes } from "../utils/error-handler";

const chatResolvers = {
  Query: {
    getMessages: async (_, { userId }, { user }) => {
      const loggedInUserId = user._id;

      if (!userId) {
        throwCustomError(
          "Receiver ID is required to get messages",
          ErrorTypes.BAD_USER_INPUT
        );
      }

      const chatUserId = await UserModel.findById(userId);
      if (!chatUserId) {
        throwCustomError(`User not found`, ErrorTypes.NOT_FOUND);
      }

      const messages = await ChatModel.find({
        $or: [
          { senderId: userId, receiverId: loggedInUserId },
          { senderId: loggedInUserId, receiverId: userId },
        ],
      })
        .populate("senderId receiverId")
        .sort({ createdAt: -1 });

      if (!messages) {
        throwCustomError("Message not found", ErrorTypes.NOT_FOUND);
      }

      return messages.map((chat) => ({
        _id: chat._id,
        sender: chat.senderId,
        receiver: chat.receiverId,
        message: chat.message,
        createdAt: chat.createdAt.toISOString(),
        seen: chat.seen,
      }));
    },
  },

  Mutation: {
    sendMessage: async (_, { input }, { user }) => {
      const { receiverId, message } = input;

      if (!receiverId) {
        throwCustomError(
          "Receiver ID is required to send a message",
          ErrorTypes.BAD_USER_INPUT
        );
      }
      if (!message) {
        throwCustomError(
          "message is required to send a message",
          ErrorTypes.BAD_USER_INPUT
        );
      }

      // Check if the receiver exists
      const receiver = await UserModel.findById(receiverId);
      if (!receiver) {
        throwCustomError("Receiver not found", ErrorTypes.NOT_FOUND);
      }

      const chat = await ChatModel.create({
        senderId: user._id,
        receiverId,
        message,
      });

      if (!chat) {
        throwCustomError("failed to send message", ErrorTypes.BAD_REQUEST);
      }

      // Retrieve the created chat with populated sender and receiver data
      const populatedChat = await ChatModel.findById(chat._id).populate(
        "senderId receiverId"
      );

      if (!populatedChat) {
        throwCustomError("failed to send message", ErrorTypes.NOT_FOUND);
      }

      const finalPopulatedMessage = {
        _id: populatedChat._id,
        sender: populatedChat.senderId,
        receiver: populatedChat.receiverId,
        message: populatedChat.message,
        createdAt: populatedChat.createdAt.toISOString(),
        seen: populatedChat.seen,
      };

      pubsub.publish(NEW_MESSAGE, {
        chatSubscription: {
          type: "NEW_MESSAGE",
          ...finalPopulatedMessage,
        },
      });

      return finalPopulatedMessage;
    },
    markAsSeen: async (_, { messageId }, { user }) => {
      const loggedInUserId = user._id;

      if (!messageId) {
        throwCustomError(
          "message ID is required to send a message",
          ErrorTypes.BAD_USER_INPUT
        );
      }

      const message = await ChatModel.findById(messageId).populate(
        "senderId receiverId"
      );

      if (!message) {
        throwCustomError("Message not found", ErrorTypes.NOT_FOUND);
      }

      if (message.receiverId._id.toString() !== loggedInUserId.toString()) {
        throwCustomError(
          "You are not authorized to mark this message as seen",
          ErrorTypes.UNAUTHENTICATED
        );
      }

      if (message.seen === true) {
        throwCustomError(
          "Message already marked as seen true",
          ErrorTypes.BAD_REQUEST
        );
      }

      message.seen = true;
      await message.save();

      const finalPopulatedMessage = {
        _id: message._id,
        sender: message.senderId,
        receiver: message.receiverId,
        message: message.message,
        createdAt: message.createdAt.toISOString(),
        seen: message.seen,
      };

      pubsub.publish(NEW_MESSAGE, {
        chatSubscription: {
          type: "SEEN_MESSAGE",
          ...finalPopulatedMessage,
        },
      });

      return finalPopulatedMessage;
    },
  },
  Subscription: {
    chatSubscription: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_MESSAGE),
        (payload, variables) => {
          const messageType = payload.chatSubscription.type;
          const targetUserId =
            messageType === "NEW_MESSAGE"
              ? payload.chatSubscription.receiver._id.toString()
              : payload.chatSubscription.sender._id.toString();
          const subscriberUserId = variables.receiverId;
          const shouldNotify = targetUserId === subscriberUserId;
          return shouldNotify;
        }
      ),
    },
  },
};

export default chatResolvers;
