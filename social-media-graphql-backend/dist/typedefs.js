const typeDefs = `#graphql

  enum Role {
    ADMIN
    MEMBER
    GUEST
  }

  type User {
    id: ID!
    email: String!
    name: String!
    avatar: String!
    createdAt: String!
    posts: [Post]!
    role: Role!
    friends: [User]
  }

  type AuthUser {
    token: String!
    user: User!
  }

  type Post {
    id: ID!
    message: String!
    author: User!
    createdAt: String!
    likes: Int!
    comments: Int!
  }

  input NewPostInput {
    userId: ID!
    message: String!
  }

  input UpdateUserInput {
    email: String
    avatar: String
  }

  input SignupInput {
    email: String!
    password: String!
  }

  input SigninInput {
    email: String!
    password: String!
  }


  type Query {
    me: User  # User details of the logged in user
    posts(userId: ID!): [Post]!  #all the posts of a userId
    post(id: ID!): Post!  #post of a particular post id
    feed: [Post]! #all the posts of the social-network
  }

  type Mutation {
    createPost(input: NewPostInput!): Post!
    updateMe(input: UpdateUserInput!): User
    signup(input: SignupInput!): AuthUser!
    signin(input: SigninInput!): AuthUser!
  }

`;
export default typeDefs;
