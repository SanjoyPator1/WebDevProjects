import { ApolloClient, InMemoryCache, createHttpLink, from, split } from "@apollo/client";
import authMiddleware from "./authLink";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws'
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_BACKEND_GRAPHQL_URL,
});

// Create a WebSocket link
const wsLink = new GraphQLWsLink(createClient({
  url: import.meta.env.VITE_BACKEND_WS_GRAPHQL_URL,
}));

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

// Use split to route queries and mutations to HTTP, and subscriptions to WebSocket
const splitLink = split(
  // Split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // Use WebSocket for subscriptions
  from([authMiddleware, errorLink, httpLink]) // Use : combine authMiddleware and errorLink with httpLink
);

// Create the Apollo Client
const client = new ApolloClient({
  link: splitLink, // Use the splitLink
  cache: new InMemoryCache(),
});

export default client;
