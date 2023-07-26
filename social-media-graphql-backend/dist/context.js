import { AuthenticationError } from "apollo-server";
import { verifyToken } from "./utils/auth";
import UserModel from "./db/user.model";
// Function to create a dummy guest user
const guestUser = {
    _id: "dummyUserId",
    email: "dummy@example.com",
    name: "Dummy User",
    avatar: "",
    createdAt: new Date().toISOString(),
    role: "GUEST",
    userJwtToken: "dummyToken",
};
const context = async ({ req }) => {
    // Allowing introspection query
    if (req.body.operationName === "IntrospectionQuery") {
        return { user: guestUser };
    }
    // Allowing the 'signUp' and 'signIn' queries to pass without giving the token
    if (req.body.operationName === "signUp" ||
        req.body.operationName === "signIn") {
        return { user: guestUser };
    }
    // Get the user token from the headers
    const token = req.headers.authorization;
    // If no token, throw an error
    if (!token) {
        throw new AuthenticationError("Invalid authorization");
    }
    // Verify and decode the token
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
        throw new AuthenticationError("Invalid token");
    }
    const userId = decodedToken.userId;
    // Find the user from the database using the userId
    const user = await UserModel.findById(userId);
    // If user is not found, throw an error
    if (!user) {
        throw new AuthenticationError("User not found");
    }
    // Return the User typeDef data
    return { user };
};
export default context;
