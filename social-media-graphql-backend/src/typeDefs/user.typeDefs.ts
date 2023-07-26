import gql from "graphql-tag";

const userTypeDefs = gql`
  enum Role {
    ADMIN
    MEMBER
    GUEST
  }

  type FriendRequest {
    id: ID!
    sender: User!
    receiver: User!
    status: String!
    createdAt: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    name: String!
    avatar: String
    createdAt: String!
    posts: [Post]
    role: Role!
    friends: [User]
    friendRequests: [FriendRequest]
  }

  type UserWithToken {
    _id: ID!
    email: String!
    name: String!
    avatar: String!
    createdAt: String!
    role: Role!
    userJwtToken: String!
  }

  input UpdateUserInput {
    email: String
    name: String
    avatar: String
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
    avatar: String
  }

  input SigninInput {
    email: String!
    password: String!
  }

  input SendFriendRequestInput {
  receiverId: ID!
}

input RespondToFriendRequestInput {
  friendRequestId: ID!
  status: String!
}

  type Query {
    findUser(userId: ID): User
    pendingFriendRequests: [FriendRequest]
    getUserById(id: ID!): User!
  }

  type Mutation {
    updateMe(input: UpdateUserInput!): User
    signup(input: SignupInput!): UserWithToken!
    signin(input: SigninInput!): UserWithToken!
    sendFriendRequest(input: SendFriendRequestInput!): FriendRequest
    respondToFriendRequest(input: RespondToFriendRequestInput!): FriendRequest
  }
`;

export default userTypeDefs;
