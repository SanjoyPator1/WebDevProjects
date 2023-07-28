// src/graphql/queries/userQueries.ts
import { gql } from "@apollo/client";

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      _id
      email
      name
      avatar
      createdAt
      role
      posts {
        _id
        message
        createdAt
      }
      friends {
        _id
        name
        avatar
      }
      friendRequests {
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