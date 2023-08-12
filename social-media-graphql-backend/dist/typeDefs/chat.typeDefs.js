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

  enum MessageType {
    NEW_MESSAGE
    SEEN_MESSAGE
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

  type ChatSubscriptionPayload implements ChatNode {
    _id: ID!
    senderId: ID
    receiverId: ID
    sender: User
    receiver: User
    message: String!
    createdAt: String!
    seen: Boolean!
    type: MessageType!
  }

  input SendMessageInput {
    receiverId: ID!
    message: String!
  }

  type Query {
    getMessages(userId: ID!): [Chat]!
  }

  type Mutation {
    sendMessage(input: SendMessageInput!): Chat!
    markAsSeen(messageId: ID!): Chat!
  }

  type Subscription {
    chatSubscription(receiverId: ID!): ChatSubscriptionPayload
  }
`;
export default chatTypeDefs;
