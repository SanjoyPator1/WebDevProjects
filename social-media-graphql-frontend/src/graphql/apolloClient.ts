import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import authMiddleware from "./authLink";
import { onError } from "@apollo/client/link/error";



const httpLink = createHttpLink({
  uri: import.meta.env.VITE_BACKEND_GRAPHQL_URL,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log("on error link")
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  };
});

// Use concat to combine authMiddleware and errorLink with httpLink
const client = new ApolloClient({
  link: from([authMiddleware, errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
