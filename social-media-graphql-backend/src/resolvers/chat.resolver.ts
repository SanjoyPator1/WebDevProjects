import { withFilter } from "graphql-subscriptions";
import ChatModel from "../db/chat.model";
import UserModel from "../db/user.model";
import pubsub, { NEW_MESSAGE } from "../pubsub";

const chatResolvers = {
  Query: {
    getMessages: async (_, { userId }) => {
      try {
        const messages = await ChatModel.find({
          $or: [{ senderId: userId }, { receiverId: userId }],
        })
          .populate("senderId receiverId")
          .sort({ createdAt: 1 });

        return messages.map((chat) => ({
          _id: chat._id,
          sender: chat.senderId,
          receiver: chat.receiverId,
          message: chat.message,
          createdAt: chat.createdAt,
          seen: chat.seen,
        }));
      } catch (error) {
        throw new Error("Failed to fetch messages");
      }
    },
  },
  Mutation: {
    sendMessage: async (_, { input }, { user }) => {
      const { receiverId, message } = input;

      if (!receiverId) {
        throw new Error("Receiver ID is required to send a message");
      }

      try {
        // Check if the receiver exists
        const receiver = await UserModel.findById(receiverId);
        if (!receiver) {
          throw new Error("Receiver not found");
        }

        const chat = await ChatModel.create({
          senderId: user._id,
          receiverId,
          message,
          createdAt: new Date().toISOString(),
        });

        // Retrieve the created chat with populated sender and receiver data
        const populatedChat = await ChatModel.findById(chat._id).populate(
          "senderId receiverId"
        );

        if (!populatedChat) {
          throw new Error("Failed to send message");
        }

        const finalPopulatedMessage = {
          _id: populatedChat._id,
          sender: populatedChat.senderId,
          receiver: populatedChat.receiverId,
          message: populatedChat.message,
          createdAt: populatedChat.createdAt,
          seen: populatedChat.seen,
        };

        pubsub.publish(NEW_MESSAGE, { newMessage: finalPopulatedMessage });

        return finalPopulatedMessage;
      } catch (error) {
        throw new Error("Failed to send message");
      }
    },
    markAsSeen: async (_, { messageId }) => {
      try {
        const message = await ChatModel.findByIdAndUpdate(
          messageId,
          { seen: true },
          { new: true }
        ).populate("senderId receiverId");

        if (!message) {
          throw new Error("Failed to mark message as seen");
        }

        return {
          _id: message._id,
          sender: message.senderId,
          receiver: message.receiverId,
          message: message.message,
          createdAt: message.createdAt,
          seen: message.seen,
        };
      } catch (error) {
        throw new Error("Failed to mark message as seen");
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_MESSAGE),
        (payload, variables) => {
          const targetUserId = payload.newMessage.receiver._id.toString();
          const subscriberUserId = variables.receiverId;
          const shouldNotify = targetUserId === subscriberUserId;

          return shouldNotify;
        }
      ),
    },
  },
};

export default chatResolvers;
