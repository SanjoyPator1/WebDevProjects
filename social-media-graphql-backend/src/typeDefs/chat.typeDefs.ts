import gql from "graphql-tag";

const chatTypeDefs = gql`
  type Chat {
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

  type Query {
    getMessages(userId: ID!): [Chat]!
  }

  type Mutation {
    sendMessage(input: SendMessageInput!): Chat!
    markAsSeen(messageId: ID!): Chat!
  }

  type Subscription {
    newMessage(receiverId: ID!): Chat
  }
`;

export default chatTypeDefs;
