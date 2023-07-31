import gql from "graphql-tag";

const postTypeDefs = gql`
  type Like {
    _id: ID!
    userId: ID!
    likeOwner: User!
    postId: ID!
    createdAt: String!
  }

  type Comment {
    _id: ID!
    userId: ID!
    commentOwner: User
    postId: ID!
    comment: String!
    date: String!
  }

  type Post {
    _id: ID!
    message: String!
    ownerId: ID!
    owner: User
    createdAt: String!
    likesCount: String!
    commentsCount: String!
    isLikedByMe: Boolean!
    likes: [Like]!
    comments: [Comment!]!
  }

  input NewCommentInput {
    postId: ID!
    comment: String!
  }

  input NewPostInput {
    message: String!
  }

  input likePostInput{
    postId: String!
  }

  type Query {
    posts(ownerId: ID!): [Post]! #all the posts of a userId
    post(id: ID!): Post! #post of a particular post id
    feed: [Post]! #all the posts of the social-network
  }

  type Mutation {
    createPost(input: NewPostInput!): Post!
    likePost(input : likePostInput): Like!
    unlikePost(input: LikePostInput!): ID! # Return the postId
    addComment(input: NewCommentInput!): Comment!
  }
`;

export default postTypeDefs;
