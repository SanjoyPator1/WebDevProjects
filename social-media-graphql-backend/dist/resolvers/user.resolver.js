import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth";
import UserModel from "../db/user.model";
import { Role } from "../typescript-models";
import FriendshipModel from "../db/friendRequest.model";
import throwCustomError, { ErrorTypes } from "../utils/error-handler";
import postResolvers from "./post.resolver";
import { createAndPublishNotification } from "../utils/notificationUtils";
const userResolver = {
    Query: {
        health: () => {
            console.log("health query hit");
            const healthObj = { status: "server working" };
            return healthObj;
        },
        // User details of the logged in user
        me: async (_, __, { user }) => {
            return user;
        },
        // Resolver for the 'findUser' query
        // This resolver fetches the user details by their provided userId.
        // If the requested user is the same as the logged-in user, it sets the friendStatus as "self" and friendId as null.
        // If a friendship record exists between the logged-in user and the viewed user with status 'pending',
        // it sets the friendStatus appropriately based on who sent the friend request and adds the friendId.
        // - If the logged-in user sent the friend request to the viewed user, the friendStatus is set as "pendingByUser".
        // - If the viewed user sent the friend request to the logged-in user, the friendStatus is set as "pendingByLoggedInUser".
        // If a friendship record exists with status 'accepted', it sets the friendStatus as "friend" and adds the friendId.
        // If there is no friendship record or the status is 'cancelled', it sets the friendStatus as "notFriend" and friendId as null.
        // If any error occurs during the process, it throws an error with a detailed message.
        findUser: async (_, { userId }, { user }) => {
            try {
                // Find the user by userId
                const requestedUser = await UserModel.findById(userId);
                if (!requestedUser) {
                    throwCustomError("User not found", ErrorTypes.NOT_FOUND);
                }
                // Check if the user is viewing their own profile
                if (requestedUser._id.toString() === user._id.toString()) {
                    return {
                        ...requestedUser.toObject(),
                        friendStatus: "self",
                        friendId: null,
                    };
                }
                // Find the friendship record between the logged-in user and the viewed user
                const friendshipRecord = await FriendshipModel.findOne({
                    $or: [
                        { userA: requestedUser._id, userB: user._id },
                        { userA: user._id, userB: requestedUser._id },
                    ],
                });
                // If the friendship record exists and status is 'pending', set the appropriate friendStatus
                if (friendshipRecord && friendshipRecord.status === "pending") {
                    if (friendshipRecord.userA.toString() === user._id.toString()) {
                        // If the loggedInUser sent the friend request to the viewed user
                        return {
                            ...requestedUser.toObject(),
                            friendStatus: "pendingByUser",
                            friendId: friendshipRecord._id,
                        };
                    }
                    else {
                        // If the viewed user sent the friend request to the loggedInUser
                        return {
                            ...requestedUser.toObject(),
                            friendStatus: "pendingByLoggedInUser",
                            friendId: friendshipRecord._id,
                        };
                    }
                }
                else if (friendshipRecord && friendshipRecord.status === "accepted") {
                    // If the friendship status is 'accepted', the users are friends
                    return {
                        ...requestedUser.toObject(),
                        friendStatus: "friend",
                        friendId: friendshipRecord._id,
                    };
                }
                // If there is no friendship record or the status is 'cancelled', the friend status is 'notFriend'
                return {
                    ...requestedUser.toObject(),
                    friendStatus: "notFriend",
                    friendId: null,
                };
            }
            catch (error) {
                throw new Error(`Failed to fetch user details: ${error.message}`);
            }
        },
        // Resolver for the 'pendingFriendRequests' query
        // This resolver fetches all pending friendship records where the current user is the receiver,
        // and sets the friendStatus as "pendingByLoggedInUser" and adds the friendId for each pending friend request.
        // It then returns an array of users who have sent friend requests to the logged-in user.
        pendingFriendRequests: async (_, __, { user }) => {
            try {
                // Find all friendship records where the current user is the receiver and the status is 'pending'
                const pendingFriendRequests = await FriendshipModel.find({
                    userB: user._id,
                    status: "pending",
                });
                console.log({ pendingFriendRequests });
                // Fetch the sender details for each friend request
                const users = await UserModel.find({
                    _id: { $in: pendingFriendRequests.map((req) => req.userA) },
                });
                console.log({ users });
                // Map each user and set the friendStatus as "pendingByLoggedInUser" and add the friendId
                const usersWithFriendStatus = users.map((userItem) => {
                    const pendingRequest = pendingFriendRequests.find((request) => request.userA.toString() === userItem._id.toString());
                    return {
                        ...userItem.toObject(),
                        friendStatus: "pendingByLoggedInUser",
                        friendId: pendingRequest ? pendingRequest._id : null,
                    };
                });
                console.log({ usersWithFriendStatus });
                return usersWithFriendStatus;
            }
            catch (error) {
                throw new Error(`Failed to fetch pending friend requests: ${error.message}`);
            }
        },
        // Resolver for the 'suggestedFriends' query
        // This resolver fetches all active friendship records related to the user.
        // It then creates a set of user IDs to exclude from the suggested friends list.
        // The excludedUserIdsSet contains the user IDs of all the people in the friendship records,
        // except for those where the logged-in user sent a friend request and then cancelled it.
        // After excluding these users, the resolver finds users who are not part of the excluded set, including the user themselves.
        // The resulting list represents the suggested friends for the logged-in user, including friendStatus and friendId if applicable.
        suggestedFriends: async (_, __, { user }) => {
            try {
                //this users will be excluded from the suggested friends list
                // Find all active friendship records related to the user
                const activeFriendshipRecords = await FriendshipModel.find({
                    $and: [
                        {
                            $or: [{ userA: user._id }, { userB: user._id }],
                        },
                    ],
                });
                // Create a Set to store the user IDs of all the people in the friendship record except for those people whom the loggedIn user has sent friend request and it was cancelled by the logged In user
                const excludedUserIdsSet = new Set();
                activeFriendshipRecords.forEach((friendRecord) => {
                    if (friendRecord.status !== "cancelled" ||
                        friendRecord.userA.toString() !== user._id.toString()) {
                        if (friendRecord.userA.toString() === user._id.toString()) {
                            excludedUserIdsSet.add(friendRecord.userB);
                        }
                        else {
                            excludedUserIdsSet.add(friendRecord.userA);
                        }
                    }
                });
                // Find all users who are not in the friendIdsSet (excluding the user themselves)
                const suggestedFriends = await UserModel.find({
                    _id: { $nin: Array.from(excludedUserIdsSet).concat([user._id]) },
                });
                // Create an array to store the final suggested friends with friendStatus and friendId
                const suggestedFriendsWithStatus = suggestedFriends.map((friend) => {
                    let friendId = null;
                    let friendStatus = "notFriend";
                    // Check if there's a friendship record between the logged-in user and the friend
                    const friendshipRecord = activeFriendshipRecords.find((record) => {
                        return ((record.userA.toString() === friend._id.toString() &&
                            record.userB.toString() === user._id.toString()) ||
                            (record.userB.toString() === friend._id.toString() &&
                                record.userA.toString() === user._id.toString()));
                    });
                    // Set the friendId if the status is cancelled and the sender is the logged In user
                    if (friendshipRecord && friendshipRecord.status === "cancelled") {
                        friendId = friendshipRecord._id;
                    }
                    return {
                        ...friend.toObject(),
                        friendStatus,
                        friendId,
                    };
                });
                return suggestedFriendsWithStatus;
            }
            catch (error) {
                throw new Error(`Failed to fetch suggested friends: ${error.message}`);
            }
        },
    },
    User: {
        // Field-level resolver for the 'friends' field of the 'User' type
        friends: async (user) => {
            try {
                // Find all friend records where the user is either userA or userB, and the status is 'accepted'
                const friendRecords = await FriendshipModel.find({
                    $and: [
                        { $or: [{ userA: user._id }, { userB: user._id }] },
                        { status: "accepted" },
                    ],
                });
                // Create an array to store the user IDs of the friends
                const friendIds = [];
                // Loop through the friend records and add the friend's user ID to the friendIds array
                friendRecords.forEach((friendRecord) => {
                    if (friendRecord.userA.toString() === user._id.toString()) {
                        friendIds.push(friendRecord.userB);
                    }
                    else {
                        friendIds.push(friendRecord.userA);
                    }
                });
                // Return the friends by querying the User collection with the friendIds array
                const friends = await UserModel.find({ _id: { $in: friendIds } });
                return friends;
            }
            catch (error) {
                throw new Error(`Failed to fetch friends : ${error.message}`);
            }
        },
        // Field-level resolver for the 'posts' field of the 'User' type
        posts: async (user) => {
            try {
                // Use the post resolvers to fetch posts based on the 'ownerId' field
                const posts = await postResolvers.Query.posts(null, {
                    ownerId: user._id,
                });
                return posts;
            }
            catch (error) {
                throw new Error(`Failed to fetch user posts: ${error.message}`);
            }
        },
    },
    FriendRequest: {
    // // Field-level resolver for the 'sender' field of the 'FriendRequest' type
    // sender: async (friendRequest) => {
    //   try {
    //     const sender = await UserModel.findById(friendRequest.userA);
    //     // If the sender is not found, you can return null or an empty object
    //     return sender || null;
    //   } catch (error) {
    //     // Handle the error gracefully
    //     console.error(`Failed to fetch sender details: ${error.message}`);
    //     return null;
    //   }
    // },
    // // Field-level resolver for the 'receiver' field of the 'FriendRequest' type
    // receiver: async (friendRequest) => {
    //   try {
    //     const receiver = await UserModel.findById(friendRequest.userB);
    //     // If the receiver is not found, you can return null or an empty object
    //     return receiver || null;
    //   } catch (error) {
    //     // Handle the error gracefully
    //     return null;
    //   }
    // },
    },
    Mutation: {
        signup: async (_, { input }) => {
            const { name, email, password, avatar, bio } = input;
            // Check if the email is already registered
            const isUserExists = await UserModel.exists({ email });
            if (isUserExists) {
                throwCustomError("Email is already registered", ErrorTypes.ALREADY_EXISTS);
            }
            // Hash the password using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            // Create the user in the database with the hashed password
            const userToCreate = {
                email,
                password: hashedPassword,
                name,
                avatar: avatar || "",
                createdAt: new Date().toISOString(),
                role: Role.MEMBER,
            };
            const newUser = await UserModel.create(userToCreate);
            // Generate a JWT token for the newly created user
            const token = generateToken(newUser._id);
            // Return the UserWithToken object
            const userWithToken = {
                _id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                avatar: newUser.avatar,
                createdAt: newUser.createdAt,
                role: newUser.role,
                userJwtToken: token,
            };
            return userWithToken;
        },
        signin: async (_, { input }) => {
            const { email, password } = input;
            // Fetch the user with the provided email from the database
            const user = await UserModel.findOne({ email });
            if (!user) {
                throwCustomError(`User not found`, ErrorTypes.NOT_FOUND);
            }
            // Compare the hashed password from the database with the provided password using bcrypt
            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) {
                throwCustomError(`Invalid password`, ErrorTypes.BAD_USER_INPUT);
            }
            // Generate a JWT token for the authenticated user
            const token = generateToken(user._id);
            // Return the UserWithToken object
            const userWithToken = {
                _id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                createdAt: user.createdAt,
                role: user.role,
                userJwtToken: token,
            };
            return userWithToken;
        },
        sendFriendRequest: async (_, { input }, { user }) => {
            try {
                const { receiverId } = input;
                // Check if the receiver exists
                const receiver = await UserModel.findById(receiverId);
                if (!receiver) {
                    throwCustomError("Receiver not found", ErrorTypes.NOT_FOUND);
                }
                // Check if a friend request already exists between the sender and receiver
                const existingRequest = await FriendshipModel.findOne({
                    $or: [
                        { userA: user._id, userB: receiverId },
                        { userA: receiverId, userB: user._id },
                    ],
                });
                if (existingRequest) {
                    // If an existing request is found, check if it has a status of "cancelled"
                    if (existingRequest.status === "cancelled") {
                        // Update the existing request status to "pending"
                        existingRequest.status = "pending";
                        existingRequest.userA = user._id;
                        existingRequest.userB = receiverId;
                        await existingRequest.save();
                        const friendRequest = {
                            id: existingRequest._id,
                            senderId: existingRequest.userA,
                            receiverId: existingRequest.userB,
                            status: existingRequest.status,
                            createdAt: existingRequest.createdAt,
                        };
                        // Call the utility function to create and publish the notification
                        await createAndPublishNotification(user._id, receiverId, "FRIEND_REQUEST", "SEND_FRIEND_REQUEST", user._id // Use senderId as linkId for the notification because he send a friend request
                        );
                        return friendRequest;
                    }
                    else {
                        // Throw an error if a request already exists with any other status
                        throwCustomError("Friend request already sent or received", ErrorTypes.BAD_REQUEST);
                    }
                }
                else {
                    // If no friend record is found, create a new friendship record with status 'pending'
                    const newFriendship = await FriendshipModel.create({
                        userA: user._id,
                        userB: receiverId,
                        status: "pending",
                    });
                    const friendRequest = {
                        id: newFriendship._id,
                        senderId: newFriendship.userA,
                        receiverId: newFriendship.userB,
                        status: newFriendship.status,
                        createdAt: newFriendship.createdAt,
                    };
                    // Call the utility function to create and publish the notification
                    await createAndPublishNotification(user._id, receiverId, "FRIEND_REQUEST", "SEND_FRIEND_REQUEST", user._id // Use senderId as linkId for the notification because he send a friend request
                    );
                    return friendRequest;
                }
            }
            catch (error) {
                throw new Error(`Failed to send friend request : ${error.message}`);
            }
        },
        // Respond to a friend request
        respondToFriendRequest: async (_, { input }, { user }) => {
            try {
                const { friendRequestId, status } = input;
                // Check if the friendship request exists
                const friendshipRequest = await FriendshipModel.findById(friendRequestId);
                if (!friendshipRequest) {
                    throwCustomError("Friendship request not found", ErrorTypes.NOT_FOUND);
                }
                // Check if the status is valid ('accepted' or 'cancelled')
                if (status !== "accepted" && status !== "cancelled") {
                    throwCustomError("Invalid status. Status must be 'accepted' or 'cancelled'", ErrorTypes.BAD_USER_INPUT);
                }
                // Update the friendship request status
                friendshipRequest.status = status;
                await friendshipRequest.save();
                // If the status is 'accepted', notify the sender
                if (status === "accepted") {
                    // Call the utility function to create and publish the notification for sender
                    await createAndPublishNotification(friendshipRequest.userB, //notification creatorUserId
                    friendshipRequest.userA, //notification targetUserId
                    "FRIEND_REQUEST", "ACCEPTED_FRIEND_REQUEST", friendshipRequest.userB.toString() // link of the accepted user ID i.e. receiverId
                    );
                }
                return {
                    id: friendshipRequest._id,
                    senderId: friendshipRequest.userA,
                    receiverId: friendshipRequest.userB,
                    status: friendshipRequest.status,
                    createdAt: friendshipRequest.createdAt,
                };
            }
            catch (error) {
                throw new Error(`Failed to respond to friend request : ${error.message}`);
            }
        },
        //update the logged in user details
        updateMe: async (_, { input }, { user }) => {
            try {
                // Find the user to be updated in the database
                const userToUpdate = await UserModel.findById(user._id);
                if (!userToUpdate) {
                    throwCustomError("User not found", ErrorTypes.NOT_FOUND);
                }
                // Update the user's profile with the new data from the input
                const { email, name, avatar, bio } = input;
                if (email) {
                    userToUpdate.email = email;
                }
                if (name) {
                    userToUpdate.name = name;
                }
                if (avatar) {
                    userToUpdate.avatar = avatar;
                }
                if (bio) {
                    userToUpdate.bio = bio;
                }
                // Save the updated user profile to the database
                const updatedUser = await userToUpdate.save();
                return updatedUser;
            }
            catch (error) {
                throw new Error(`Failed to update user profile: ${error.message}`);
            }
        },
    },
};
export default userResolver;
