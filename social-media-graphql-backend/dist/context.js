import { AuthenticationError } from "apollo-server";
import UserModel from "./db/user.model";
import { verifyToken } from "./utils/auth";
const context = async ({ req }) => {
    //allowing introspection query
    if (req.body.operationName === "IntrospectionQuery") {
        return {};
    }
    // allowing the 'signUp' and 'signIn' queries to pass without giving the token
    if (req.body.operationName === "signUp" ||
        req.body.operationName === "signIn") {
        return {};
    }
    // Get the user token from the headers
    const token = req.headers.authorization;
    // If no token, throw an error
    if (!token) {
        throw new AuthenticationError("Invalid authorization");
    }
    try {
        // Verify and decode the token
        const decodedToken = verifyToken(token);
        const userId = decodedToken.userId;
        // Find the user from the database using the userId
        const user = await UserModel.findById(userId);
        // If user is not found, throw an error
        if (!user) {
            throw new AuthenticationError("User not found");
        }
        // Return the User typeDef data
        return { user };
    }
    catch (error) {
        // If token verification or database query fails, throw an error
        throw new AuthenticationError("Invalid authorization");
    }
};
export default context;
