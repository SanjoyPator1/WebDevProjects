// src/graphql/mutations/postMutations.ts
import { gql } from "@apollo/client";

export const CREATE_POST = gql`
mutation CreatePost($input: NewPostInput!) {
  createPost(input: $input) {
    _id
    message
    ownerId
    createdAt
    likesCount
    commentsCount
    isLikedByMe
    owner {
      _id
      name
      avatar
    }
    comments {
      _id
      comment
      date
      commentOwner {
        _id
        name
        avatar
      }
    }
  }
}
`;

export const LIKE_POST = gql`
  mutation LikePost($input: reactionPostInput!) {
    likePost(input: $input) {
      _id
      userId
      createdAt
      postId
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation UnlikePost($input: reactionPostInput!) {
    unlikePost(input: $input)
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($postId: ID!, $comment: String!) {
    addComment(input: { postId: $postId, comment: $comment }) {
      _id
      comment
      date
      commentOwner {
        _id
        name
        avatar
      }
    }
  }
`;