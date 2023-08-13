import gql from "graphql-tag";
const chatTypeDefs = gql `
  interface ChatNode {
    _id: ID!
    senderId: ID
    receiverId: ID
    sender: User
    receiver: User
    message: String!
    createdAt: String!
    seen: Boolean!
  }

  type Chat implements ChatNode {
    _id: ID!
    senderId: ID
    receiverId: ID
    sender: User
    receiver: User
    message: String!
    createdAt: String!
    seen: Boolean!
  }

  type NewMessageChatSubscriptionPayload implements ChatNode {
    _id: ID!
    senderId: ID
    receiverId: ID
    sender: User
    receiver: User
    message: String!
    createdAt: String!
    seen: Boolean!
  }

  type SeenMessageChatSubscriptionPayload implements ChatNode {
    _id: ID!
    senderId: ID
    receiverId: ID
    sender: User
    receiver: User
    message: String!
    createdAt: String!
    seen: Boolean!
  }

  input SendMessageInput {
    receiverId: ID!
    message: String!
  }

  input MarkAsSeenInput {
    messageIds: [ID!]!
  }

  type Query {
    getMessages(userId: ID!): [Chat]!
  }

  type Mutation {
    sendMessage(input: SendMessageInput!): Chat!
    markAsSeen(input: MarkAsSeenInput!): [Chat]!
  }

  type Subscription {
    newMessageChatSubscription(receiverId: ID!): NewMessageChatSubscriptionPayload
    seenMessageChatSubscription(receiverId: ID!): [SeenMessageChatSubscriptionPayload]
  }
`;
export default chatTypeDefs;
