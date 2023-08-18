import gql from "graphql-tag";

const userTypeDefs = gql`
  type HealthCheck {
    status: String!
  }

  enum Role {
    ADMIN
    MEMBER
    GUEST
  }

  type FriendRequest {
    id: ID!
    senderId: ID!
    receiverId: ID!
    status: String!
    createdAt: String!
  }

  type User {
    _id: ID!
    email: String!
    name: String!
    avatar: String
    createdAt: String!
    bio: String
    friendStatus: String!
    friendId: ID
    posts: [Post]
    role: Role!
    friends: [User]
    friendRequests: [FriendRequest]
    numberOfUnseenMessages: Int
  }

  type UserWithToken {
    _id: ID!
    email: String!
    name: String!
    avatar: String!
    createdAt: String!
    role: Role!
    bio: String
    userJwtToken: String!
  }

  input UpdateUserInput {
    email: String
    name: String
    avatar: String
    bio: String
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

  enum GoogleAuthType {
    LOG_IN
    SIGN_UP
  }

  input GoogleAuthInput {
    token: String!
    type: GoogleAuthType!
  }

  input SendFriendRequestInput {
    receiverId: ID!
  }

  input RespondToFriendRequestInput {
    friendRequestId: ID!
    status: String!
  }

  type Query {
    health: HealthCheck
    me: User
    findUser(userId: ID): User
    pendingFriendRequests: [User]
    suggestedFriends: [User]
    findFriends(userId: ID!): [User]
    findUsersByName(name: String!): [User]
  }

  type Mutation {
    updateMe(input: UpdateUserInput!): User
    signup(input: SignupInput!): UserWithToken!
    signin(input: SigninInput!): UserWithToken!
    googleAuth(input: GoogleAuthInput!) : UserWithToken!
    sendFriendRequest(input: SendFriendRequestInput!): FriendRequest
    respondToFriendRequest(input: RespondToFriendRequestInput!): FriendRequest
  }
`;

export default userTypeDefs;
