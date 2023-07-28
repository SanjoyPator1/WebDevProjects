// src/graphql/authLink.js
import { ApolloLink, concat } from "@apollo/client";
import { JWT_TOKEN_NAME } from "../lib/constants";

// Get the JWT token from localStorage
const getToken = () => {
  const userJwtToken = localStorage.getItem(JWT_TOKEN_NAME);
  return userJwtToken ? userJwtToken : "";
};

// Create the middleware
const authMiddleware = new ApolloLink((operation, forward) => {
  // Add the authorization header to the GraphQL request
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: getToken(),
    },
  }));

  return forward(operation);
});

export default authMiddleware;
