// src/graphql/queries/userQueries.ts
import { gql } from "@apollo/client";

export const LOGGEDIN_USER = gql`
  query LOGGEDIN_USER {
    me {
      _id
      name
      email
      avatar
      role
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GET_USER_BY_ID($userId: ID!) {
    findUser(userId: $userId) {
      _id
      avatar
      name
      bio
      friendStatus
      friendId
      posts {
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
  }
`;

export const PENDING_FRIEND_REQUEST = gql`
  query PENDING_FRIEND_REQUEST {
    pendingFriendRequests {
      _id
      avatar
      name
      bio
      friendStatus
      friendId
    }
  }
`;
