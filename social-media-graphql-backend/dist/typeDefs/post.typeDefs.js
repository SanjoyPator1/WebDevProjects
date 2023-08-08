import gql from "graphql-tag";
const postTypeDefs = gql `
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

  enum NotificationType {
        POST
        FRIEND_REQUEST
    }

  enum NotificationAction {
        LIKE
        COMMENT
        SEND_FRIEND_REQUEST
        ACCEPTED_FRIEND_REQUEST
    }

  type NotificationPayload {
    _id: ID!
    creatorUser: User!
    targetUser: User!
    module: NotificationType!
    action: NotificationAction!
    linkId: ID
    createdAt: String!
    updatedAt: String!
    seen: Boolean!
  }

  type NotificationSeen {
    _id: ID!
    seen: Boolean!
  }

  type Subscription {
    newNotification(userId: ID!): NotificationPayload
  }

  input NewCommentInput {
    postId: ID!
    comment: String!
  }

  input NewPostInput {
    message: String!
  }

  input reactionPostInput {
    postId: String!
  }

  type Query {
    posts(ownerId: ID!): [Post]! #all the posts of a userId
    post(id: ID!): Post! #post of a particular post id
    feed: [Post]! #all the posts of the social-network
    notifications(targetId: ID!): [NotificationPayload]! #all the notifications 
  }

  type Mutation {
    createPost(input: NewPostInput!): Post!
    likePost(input: reactionPostInput): Like!
    unlikePost(input: reactionPostInput!): ID! # Return the postId
    addComment(input: NewCommentInput!): Comment!
    markNotificationAsSeen(notificationId: ID!): NotificationSeen!
  }
`;
export default postTypeDefs;
