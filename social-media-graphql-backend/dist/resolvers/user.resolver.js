import { AuthenticationError } from "apollo-server";
import bcrypt from 'bcrypt';
import { fakeUsers } from "../libs/fakeData";
import { generateToken } from "../utils/auth";
import UserModel from "../db/user.model";
import { Role } from "../typescript-models";
const userResolver = {
    Query: {
        //User details of the logged in user
        me: (_, __, { user }) => {
            console.log("me resolver ");
            console.log({ user });
            return fakeUsers[0];
        },
    },
    User: {
        // Field-level resolver for the 'friends' field of the 'User' type
        friends: (user) => {
            // Get the IDs of the user's friends from the 'friends' field
            const friendIds = user.friends;
            // Find the friend objects based on their IDs
            const friends = fakeUsers.filter((fakeUser) => friendIds.includes(fakeUser._id));
            return friends;
        },
    },
    Mutation: {
        signup: async (_, { input }) => {
            const { name, email, password, avatar } = input;
            // Check if the email is already registered
            const isUserExists = await UserModel.exists({ email });
            if (isUserExists) {
                throw new AuthenticationError('Email is already registered');
            }
            // Hash the password using bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            // Create the user in the database with the hashed password
            const userToCreate = {
                email,
                password: hashedPassword,
                name,
                avatar: avatar || '',
                createdAt: new Date().toISOString(),
                role: Role.MEMBER,
                friends: [],
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
                throw new AuthenticationError('User not found');
            }
            // Compare the hashed password from the database with the provided password using bcrypt
            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) {
                throw new AuthenticationError('Invalid password');
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
    }
    //   Mutation: {
    //     createPost: (_, { input }, { user, models }) => {
    //       const post = models.Post.createOne({ ...input, author: user.id });
    //       // pubSub.publish(NEW_POST, { newPost: post })
    //       return post;
    //     },
    //     updateMe: (_, { input }, { user, models }) => {
    //       return models.User.updateOne({ id: user.id }, input);
    //     },
    //     signup(_, { input }, { models, createToken }) {
    //       const existing = models.User.findOne({ email: input.email });
    //       if (existing) {
    //         throw new Error("nope");
    //       }
    //       const user = models.User.createOne({
    //         ...input,
    //         verified: false,
    //         avatar: "http",
    //       });
    //       const token = createToken(user);
    //       return { token, user };
    //     },
    //     signin(_, { input }, { models, createToken }) {
    //       const user = models.User.findOne(input);
    //       if (!user) {
    //         throw new Error("nope");
    //       }
    //       const token = createToken(user);
    //       return { token, user };
    //     },
    //   },
};
export default userResolver;
