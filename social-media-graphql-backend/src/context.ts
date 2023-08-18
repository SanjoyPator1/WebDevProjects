
import { verifyToken } from "./utils/auth";
import UserModel from "./db/user.model";
import throwCustomError, {
  ErrorTypes,
} from "./utils/error-handler";

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
   //Allowing health query
  // Allowing the 'signUp' and 'signIn' queries to pass without giving the token
  if (
    req.body.operationName === "IntrospectionQuery" ||
    req.body.operationName === "health" ||
    req.body.operationName === "signUp" ||
    req.body.operationName === "signIn" ||
    req.body.operationName === "googleAuth"
  ) {
    return { user: guestUser };
  }

  // Get the user token from the headers
  const token = req.headers.authorization;

  // If no token, throw an error
  if (!token) {
    throwCustomError(
      'Invalid authorization',
      ErrorTypes.UNAUTHENTICATED
    );
  }
  // Verify and decode the token
  const decodedToken = verifyToken(token);

  if(!decodedToken){
    throwCustomError(
      'Invalid token',
      ErrorTypes.UNAUTHENTICATED
    );
  }

  const userId = decodedToken.userId;

  // Find the user from the database using the userId
  const user = await UserModel.findById(userId);

  // If user is not found, throw an error
  if (!user) {
    throwCustomError(
      'User not found',
      ErrorTypes.NOT_FOUND
    );
  }

  // Return the User typeDef data
  return { user };
};

export default context;
