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
  query findUser($userId: ID!) {
    findUser(userId: $userId) {
      _id
      name
      email
      avatar
      createdAt
      role
      friends {
        _id
        name
      }
    }
  }
`;

export const PENDING_FRIEND_REQUESTS = gql`
  query PendingFriendRequests {
    pendingFriendRequests {
      id
      sender {
        _id
        name
        avatar
      }
      receiver {
        _id
        name
        avatar
      }
      status
      createdAt
    }
  }
`;