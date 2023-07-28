import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth";
import UserModel from "../db/user.model";
import { Role } from "../typescript-models";
import FriendshipModel from "../db/friendRequest.model";
import throwCustomError, {
  ErrorTypes,
} from "../utils/error-handler";

const userResolver = {
  Query: {

    health: () =>{
      console.log("health query hit")
      const healthObj = {status : "server working"}
      return healthObj
    },
    // User details of the logged in user
    me: async (_, __, { user }) => {
      return user
    },
    findUser: async (_, { userId }, { user }) => {
      try {
        // If 'userId' input is provided, find the user by userId
        if (userId) {
          const requestedUser = await UserModel.findById(userId);
          if (!requestedUser) {
            throwCustomError(
              "User not found",
              ErrorTypes.NOT_FOUND
            );
          }
          return requestedUser;
        }

        // If 'userId' input is not provided, return the user from the context
        return user;
      } catch (error) {
        throw new Error(`Failed to fetch user details: ${error.message}`);
      }
    },
    //query to find pending friend request
    pendingFriendRequests: async (_, __, { user }) => {
      try {
        // Find all friendship records where the current user is the receiver and the status is 'pending'
        const pendingFriendRequests = await FriendshipModel.find({
          userB: user._id,
          status: "pending",
        });
        // Return the pending friend requests
        return pendingFriendRequests;
      } catch (error) {
        throw new Error(
          `Failed to fetch pending friend requests: ${error.message}`
        );
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
          } else {
            friendIds.push(friendRecord.userA);
          }
        });

        // Return the friends by querying the User collection with the friendIds array
        const friends = await UserModel.find({ _id: { $in: friendIds } });

        return friends;
      } catch (error) {
        throw new Error(`Failed to fetch friends : ${error.message}`);
      }
    },
  },
  FriendRequest: {
    // Field-level resolver for the 'sender' field of the 'FriendRequest' type
    sender: async (friendRequest) => {
      try {
        const sender = await UserModel.findById(friendRequest.userA);
        // If the sender is not found, you can return null or an empty object
        return sender || null;
      } catch (error) {
        // Handle the error gracefully
        console.error(`Failed to fetch sender details: ${error.message}`);
        return null;
      }
    },
    // Field-level resolver for the 'receiver' field of the 'FriendRequest' type
    receiver: async (friendRequest) => {
      try {
        const receiver = await UserModel.findById(friendRequest.userB);
        // If the receiver is not found, you can return null or an empty object
        return receiver || null;
      } catch (error) {
        // Handle the error gracefully
        return null;
      }
    },
  },

  Mutation: {
    signup: async (_, { input }) => {
      const { name, email, password, avatar } = input;

      // Check if the email is already registered
      const isUserExists = await UserModel.exists({ email });
      if (isUserExists) {
        throwCustomError(
          "Email is already registered",
          ErrorTypes.ALREADY_EXISTS
        );
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
        throwCustomError(
          `User not found`,
          ErrorTypes.NOT_FOUND
        )
      }

      // Compare the hashed password from the database with the provided password using bcrypt
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        throwCustomError(
          `Invalid password`,
          ErrorTypes.BAD_USER_INPUT
        )
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
          throwCustomError(
            "Receiver not found",
            ErrorTypes.NOT_FOUND
          )
        }

        // Check if a friend request already exists between the sender and receiver
        const existingRequest = await FriendshipModel.findOne({
          $or: [
            { userA: user._id, userB: receiverId },
            { userA: receiverId, userB: user._id },
          ],
        });

        if (existingRequest) {
          throwCustomError(
            "Friend request already sent or received",
            ErrorTypes.BAD_REQUEST
          )
        }

        // Create a new friendship record with status 'pending'
        const newFriendship = await FriendshipModel.create({
          userA: user._id,
          userB: receiverId,
          status: "pending",
        });

        const friendRequest = {
          id: newFriendship._id,
          sender: newFriendship.userA,
          receiver: newFriendship.userB,
          status: newFriendship.status,
          createdAt: newFriendship.createdAt,
        };

        return friendRequest;
      } catch (error) {
        throw new Error(`Failed to send friend request : ${error.message}`);
      }
    },
    // Respond to a friend request
    respondToFriendRequest: async (_, { input }, { user }) => {
      try {
        const { friendRequestId, status } = input;

        // Check if the friendship request exists
        const friendshipRequest = await FriendshipModel.findById(
          friendRequestId
        );
        if (!friendshipRequest) {
          throwCustomError(
            "Friendship request not found",
            ErrorTypes.NOT_FOUND
          )
        }

        // Check if the current user is the receiver of the friend request (sending self)
        const isSamePerson = friendshipRequest.userB.equals(user._id);
        if (isSamePerson) {
          throwCustomError(
            "You are not authorized to respond to this friend request",
            ErrorTypes.BAD_REQUEST
          )
        }

        // Check if the status is valid ('accepted' or 'cancelled')
        if (status !== "accepted" && status !== "cancelled") {
          throwCustomError(
            "Invalid status. Status must be 'accepted' or 'cancelled'",
            ErrorTypes.BAD_USER_INPUT
          )
        }

        // Update the friendship request status
        friendshipRequest.status = status;
        await friendshipRequest.save();

        return friendshipRequest;
      } catch (error) {
        throw new Error(
          `Failed to respond to friend request : ${error.message}`
        );
      }
    },
  },
};

export default userResolver;
