import { UserInputError } from "apollo-server";
import PostModel from "../db/post.model";
import UserModel from "../db/user.model";
import CommentModel from "../db/comment.model";
import LikeModel from "../db/like.model";
const postResolvers = {
    Query: {
        posts: async (_, { ownerId }) => {
            try {
                const userPosts = await PostModel.find({ ownerId });
                return userPosts;
            }
            catch (error) {
                throw new Error("Failed to fetch user posts");
            }
        },
        post: async (_, { id }) => {
            try {
                const post = await PostModel.findById(id);
                if (!post) {
                    throw new UserInputError(`Post with ID ${id} not found`);
                }
                return post;
            }
            catch (error) {
                throw new Error("Failed to fetch the post");
            }
        },
        feed: async () => {
            try {
                return PostModel.find();
            }
            catch (error) {
                throw new Error("Failed to fetch the feed");
            }
        },
    },
    Post: {
        owner: async (post) => {
            try {
                return UserModel.findById(post.ownerId);
            }
            catch (error) {
                throw new Error("Failed to fetch the post owner");
            }
        },
        likes: async (post) => {
            console.log(`getting like details for post ${post}`);
            try {
                // Find all likes associated with the post using the postId field
                const likes = await LikeModel.find({ postId: post._id });
                console.log({ likes });
                return likes;
            }
            catch (error) {
                throw new Error("Failed to fetch likes");
            }
        },
        comments: async (post) => {
            try {
                const comments = await CommentModel.find({ postId: post._id });
                return comments;
            }
            catch (error) {
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
            }
            catch (error) {
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
            }
            catch (error) {
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
            }
            catch (error) {
                throw new Error("Failed to create the post");
            }
        },
        likePost: async (_, { input }, { user }) => {
            const { postId } = input;
            try {
                // Check if the post exists
                const post = await PostModel.findById(postId);
                if (!post) {
                    throw new UserInputError(`Post with ID ${postId} not found`);
                }
                // Check if the user has already liked the post
                const existingLike = await LikeModel.findOne({
                    userId: user._id,
                    postId,
                });
                if (existingLike) {
                    throw new UserInputError("You have already liked this post");
                }
                // Create a new Like document and associate it with the post and user
                const newLike = await LikeModel.create({
                    userId: user._id,
                    postId,
                });
                // Return the post with updated likes
                return newLike;
            }
            catch (error) {
                throw new Error(`Failed to like the post: ${error.message}`);
            }
        },
        addComment: async (_, { input }, { user }) => {
            const { postId, comment } = input;
            try {
                // Create the comment in the database with the provided input
                const newComment = await CommentModel.create({
                    userId: user._id,
                    postId,
                    comment,
                    date: new Date().toISOString(),
                });
                return newComment;
            }
            catch (error) {
                throw new Error("Failed to add the comment");
            }
        },
    },
};
export default postResolvers;
