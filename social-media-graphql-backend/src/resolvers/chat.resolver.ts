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
          .sort({ createdAt: -1 });

        return messages.map((chat) => ({
          _id: chat._id,
          sender: chat.senderId,
          receiver: chat.receiverId,
          message: chat.message,
          createdAt: chat.createdAt.toISOString(),
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
          createdAt: populatedChat.createdAt.toISOString(),
          seen: populatedChat.seen,
        };

        console.log("sending new message in subscription", finalPopulatedMessage);

        pubsub.publish(NEW_MESSAGE, {
          chatSubscription: {
            type: "NEW_MESSAGE",
            ...finalPopulatedMessage,
          },
        });

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
      } catch (error) {
        throw new Error("Failed to mark message as seen");
      }
    },
  },
  Subscription: {
    chatSubscription: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_MESSAGE),
        (payload, variables) => {
          console.log("chat subscription ")
          const messageType = payload.chatSubscription.type;
          const targetUserId =
          messageType === "NEW_MESSAGE"
          ? payload.chatSubscription.receiver._id.toString()
          : payload.chatSubscription.sender._id.toString();
          const subscriberUserId = variables.receiverId;
          const shouldNotify = targetUserId === subscriberUserId;
          
          console.log({payloadData:payload.chatSubscription})
          console.log({subscriberUserId})
          return shouldNotify;
        }
        ),
    },
  },
};

export default chatResolvers;
