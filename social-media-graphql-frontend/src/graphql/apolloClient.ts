import { ApolloClient, InMemoryCache, createHttpLink, concat } from "@apollo/client";
import authMiddleware from "./authLink";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_BACKEND_GRAPHQL_URL,
});

// Use concat to combine authMiddleware with httpLink
const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});

export default client;
