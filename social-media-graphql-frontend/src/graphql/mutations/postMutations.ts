// src/graphql/mutations/postMutations.ts
import { gql } from "@apollo/client";

export const CREATE_POST = gql`
  mutation CreatePost($input: NewPostInput!) {
    createPost(input: $input) {
      _id
      message
      ownerId
      createdAt
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($input: likePostInput!) {
    likePost(input: $input) {
      _id
      userId
      createdAt
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($input: NewCommentInput!) {
    addComment(input: $input) {
      userId
      comment
      date
    }
  }
`;