// src/graphql/queries/postQueries.ts
import { gql } from "@apollo/client";

export const GET_POSTS_BY_OWNER_ID = gql`
  query GetPostsByOwnerId($ownerId: ID!) {
    posts(ownerId: $ownerId) {
      _id
      message
      createdAt
      likes {
        _id
        userId
        createdAt
      }
      comments {
        userId
        comment
        date
      }
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query getPostById($postId: ID!) {
    post(id: $postId) {
      _id
      message
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

//get feed gets all the post available -> irrespective of friend status
export const GET_FEED = gql`
  query getAllPosts {
    feed {
      _id
      message
      createdAt
      likesCount
      commentsCount
      isLikedByMe
      owner {
        _id
        name
        avatar
      }
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GET_NOTIFICATIONS($targetId: ID!) {
    notifications(targetId: $targetId) {
      _id
      creatorUser {
        _id
        name
        avatar
      }
      module
      action
      linkId
      createdAt
      seen
    }
  }
`;

export const NEW_NOTIFICATION = gql`
  subscription NewNotification($userId: ID!) {
    newNotification(userId: $userId) {
      _id
      creatorUser {
        _id
        name
        avatar
      }
      module
      action
      linkId
      createdAt
      seen
    }
  }
`;
