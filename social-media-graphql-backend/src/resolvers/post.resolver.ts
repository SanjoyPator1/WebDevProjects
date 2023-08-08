import throwCustomError, { ErrorTypes } from "../utils/error-handler";
import PostModel from "../db/post.model";
import UserModel from "../db/user.model";
import CommentModel from "../db/comment.model";
import LikeModel from "../db/like.model";
import { withFilter } from "graphql-subscriptions";
import { createAndPublishNotification } from "../utils/notificationUtils";
import pubsub, { NEW_NOTIFICATION } from "../pubsub";
import NotificationModel from "../db/notification.model";
import userResolver from "./user.resolver";

const postResolvers = {
  Query: {
    posts: async (_, { ownerId }) => {
      try {
        const userPosts = await PostModel.find({ ownerId });
        return userPosts;
      } catch (error) {
        throw new Error("Failed to fetch user posts");
      }
    },

    post: async (_, { id }) => {
      try {
        const post = await PostModel.findById(id);

        if (!post) {
          throwCustomError(
            `Post with ID ${id} not found`,
            ErrorTypes.NOT_FOUND
          );
        }

        return post;
      } catch (error) {
        throw new Error("Failed to fetch the post");
      }
    },

    feed: async () => {
      try {
        const feedData = PostModel.find().sort({ createdAt: -1 });
        return feedData;
      } catch (error) {
        throw new Error("Failed to fetch the feed");
      }
    },
    notifications: async (_, { targetId }, { user }) => {
      try {
        // Fetch all notifications associated with the target user ID
        const notifications = await NotificationModel.find({
          targetUserId: targetId,
        });

        // Fetch the associated creator and target users using userResolver
        const notificationPayloads = await Promise.all(
          notifications.map(async (notification) => {
            const [creatorUser, targetUser] = await Promise.all([
              userResolver.Query.findUser(
                null,
                {
                  userId: notification.creatorUserId,
                },
                { user }
              ),
              userResolver.Query.findUser(
                null,
                {
                  userId: notification.targetUserId,
                },
                { user }
              ),
            ]);

            // Construct the notification payload with necessary data
            const notificationPayload = {
              _id: notification._id,
              creatorUser,
              targetUser,
              module: notification.module,
              action: notification.action,
              linkId: notification.linkId,
              createdAt: notification.createdAt.toISOString(),
              updatedAt: notification.updatedAt.toISOString(),
              seen: notification.seen,
            };

            return notificationPayload;
          })
        );

        return notificationPayloads;
      } catch (error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }
    },
  },
  Post: {
    owner: async (post) => {
      try {
        return UserModel.findById(post.ownerId);
      } catch (error) {
        throw new Error("Failed to fetch the post owner");
      }
    },
    // Field-level resolver for the 'likesCount' field
    likesCount: async (post) => {
      try {
        // Find the total count of likes associated with the post using the postId field
        const likesCount = await LikeModel.countDocuments({ postId: post._id });
        return likesCount.toString(); // Convert the count to a string for compatibility with the GraphQL schema
      } catch (error) {
        throw new Error("Failed to fetch likes count");
      }
    },
    // Field-level resolver for the 'commentsCount' field
    commentsCount: async (post) => {
      try {
        // Find the total count of comments associated with the post using the postId field
        const commentsCount = await CommentModel.countDocuments({
          postId: post._id,
        });
        return commentsCount.toString(); // Convert the count to a string for compatibility with the GraphQL schema
      } catch (error) {
        throw new Error("Failed to fetch comments count");
      }
    },
    // Field-level resolver for the 'isLikedByMe' field
    isLikedByMe: async (post, _, { user }) => {
      try {
        // Check if the user has already liked the post
        const existingLike = await LikeModel.findOne({
          userId: user._id,
          postId: post._id,
        });

        return !!existingLike; // Return true if the like exists, otherwise false
      } catch (error) {
        throw new Error("Failed to fetch like status");
      }
    },
    likes: async (post) => {
      try {
        // Find all likes associated with the post using the postId field
        const likes = await LikeModel.find({ postId: post._id });
        return likes;
      } catch (error) {
        throw new Error("Failed to fetch likes");
      }
    },
    comments: async (post) => {
      try {
        const comments = await CommentModel.find({ postId: post._id });
        return comments;
      } catch (error) {
        throw new Error("Failed to fetch comments");
      }
    },
  },
  Like: {
    likeOwner: async (like) => {
      try {
        const owner = await UserModel.findById(like.userId);
        if (!owner) {
          throw new Error(`Owner with ID ${like.userId} not found`);
        }
        return owner;
      } catch (error) {
        throw new Error("Failed to fetch the like owner");
      }
    },
  },
  Comment: {
    commentOwner: async (comment) => {
      try {
        const owner = await UserModel.findById(comment.userId);
        if (!owner) {
          throw new Error(`Owner with ID ${comment.userId} not found`);
        }
        return owner;
      } catch (error) {
        throw new Error("Failed to fetch the comment owner");
      }
    },
  },
  Mutation: {
    createPost: async (_, { input }, { user }) => {
      const { message } = input;

      try {
        // Create the post in the database with the provided input
        const newPost = await PostModel.create({
          message,
          ownerId: user._id,
          createdAt: new Date().toISOString(),
        });

        return newPost;
      } catch (error) {
        throw new Error("Failed to create the post");
      }
    },
    likePost: async (_, { input }, { user }) => {
      const { postId } = input;

      try {
        // Check if the post exists
        const post = await PostModel.findById(postId);
        if (!post) {
          throwCustomError(
            `Post with ID ${postId} not found`,
            ErrorTypes.NOT_FOUND
          );
        }

        // Check if the user has already liked the post
        const existingLike = await LikeModel.findOne({
          userId: user._id,
          postId,
        });

        if (existingLike) {
          throwCustomError(
            "You have already liked this post",
            ErrorTypes.BAD_USER_INPUT
          );
        }

        // Create a new Like document and associate it with the post and user
        const newLike = await LikeModel.create({
          userId: user._id,
          postId,
        });

        // Use the utility function to create and publish the notification
        await createAndPublishNotification(
          user._id,
          post.ownerId,
          "POST",
          "LIKE",
          postId
        );

        // Return the post with updated likes
        return newLike;
      } catch (error) {
        throw new Error(`Failed to like the post: ${error.message}`);
      }
    },
    unlikePost: async (_, { input }, { user }) => {
      const { postId } = input;

      try {
        // Check if the post exists
        const post = await PostModel.findById(postId);
        if (!post) {
          throwCustomError(
            `Post with ID ${postId} not found`,
            ErrorTypes.NOT_FOUND
          );
        }

        // Find and delete the like associated with the post and the current user
        const deletedLike = await LikeModel.findOneAndDelete({
          userId: user._id,
          postId,
        });

        if (!deletedLike) {
          throwCustomError(
            "You have not liked this post",
            ErrorTypes.BAD_USER_INPUT
          );
        }

        // Return the postId
        return postId;
      } catch (error) {
        throw new Error(`Failed to unlike the post: ${error.message}`);
      }
    },
    addComment: async (_, { input }, { user }) => {
      const { postId, comment } = input;

      try {
        // Check if the post exists
        const post = await PostModel.findById(postId);
        if (!post) {
          throwCustomError(
            `Post with ID ${postId} not found`,
            ErrorTypes.NOT_FOUND
          );
        }

        // Create the comment in the database with the provided input
        const newComment = await CommentModel.create({
          userId: user._id,
          postId,
          comment,
          date: new Date().toISOString(),
        });

        // Use the utility function to create and publish the notification
        await createAndPublishNotification(
          user._id,
          post.ownerId,
          "POST",
          "COMMENT",
          postId
        );

        return newComment;
      } catch (error) {
        throw new Error("Failed to add the comment");
      }
    },
    markNotificationAsSeen: async (_, { notificationId }) => {
      try {
        // Find the notification by ID
        const notification = await NotificationModel.findById(notificationId);

        //check if the notification exist
        if (!notification) {
          throwCustomError(
            `Notification with ID ${notification._id} not found`,
            ErrorTypes.NOT_FOUND
          );
        }

        // If the notification is already marked as seen, throw an error
        if (notification.seen) {
          throwCustomError(
            "Notification is already marked as seen",
            ErrorTypes.ALREADY_EXISTS
          );
        }

        // Update the 'seen' field to true
        notification.seen = true;
        await notification.save();

        // Fetch the associated creator and target users
        // const [creatorUser, targetUser] = await Promise.all([
        //   UserModel.findById(notification.creatorUserId),
        //   UserModel.findById(notification.targetUserId),
        // ]);

        // Construct the notification payload with necessary data
        const notificationPayload = {
          _id: notification._id,
          // creatorUser,
          // targetUser,
          // module: notification.module,
          // action: notification.action,
          // linkId: notification.linkId,
          // createdAt: notification.createdAt.toISOString(),
          // updatedAt: notification.updatedAt.toISOString(),
          seen: notification.seen,
        };

        return notificationPayload;
      } catch (error) {
        throw new Error(
          `Failed to mark notification as seen: ${error.message}`
        );
      }
    },
  },
  Subscription: {
    newNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_NOTIFICATION),
        (payload, variables) => {
          const targetUserId =
            payload.newNotification.targetUser._id.toString();
          const subscriberUserId = variables.userId.toString();
          const shouldNotify = targetUserId === subscriberUserId;
          return shouldNotify;
        }
      ),
    },
  },
};

export default postResolvers;
