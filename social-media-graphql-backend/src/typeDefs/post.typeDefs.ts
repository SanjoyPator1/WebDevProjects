import gql from 'graphql-tag';

const postTypeDefs = gql`

  type Post {
    _id: ID!
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

  type Query {
    posts(userId: ID!): [Post]!  #all the posts of a userId
    post(id: ID!): Post!  #post of a particular post id
    feed: [Post]! #all the posts of the social-network
  }

  type Mutation {
    createPost(input: NewPostInput!): Post!
  }

`;

export default postTypeDefs;
