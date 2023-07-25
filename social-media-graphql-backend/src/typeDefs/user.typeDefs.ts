import gql from 'graphql-tag';

const userTypeDefs = gql`

  enum Role {
    ADMIN
    MEMBER
    GUEST
  }

  type User {
    _id: ID!
    email: String!
    password: String
    name: String!
    avatar: String
    createdAt: String!
    posts: [Post]!
    role: Role!
    friends: [User]
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


  type Query {
    me: User  # User details of the logged in user
    getUserById(id: ID!): User!
  }

  type Mutation {
    updateMe(input: UpdateUserInput!): User
    signup(input: SignupInput!): UserWithToken!
    signin(input: SigninInput!): UserWithToken!
  }

`;

export default userTypeDefs;
