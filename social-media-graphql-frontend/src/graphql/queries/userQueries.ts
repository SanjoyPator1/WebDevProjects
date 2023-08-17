// src/graphql/queries/userQueries.ts
import { gql } from "@apollo/client";

export const LOGGEDIN_USER = gql`
  query LOGGEDIN_USER {
    me {
      _id
      name
      email
      avatar
      bio
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

export const SUGGESTED_FRIENDS = gql`
  query SUGGESTED_FRIENDS {
    suggestedFriends {
      _id
      avatar
      name
      bio
      friendStatus
      friendId
    }
  }
`;

export const FIND_FRIENDS = gql`
  query FindFriends($userId: ID!) {
    findFriends(userId: $userId) {
      _id
      name
      avatar
    }
  }
`;

export const FIND_USERS_BY_NAME = gql`
  query FIND_USERS_BY_NAME($name: String!) {
    findUsersByName(name: $name) {
      _id
      avatar
      name
    }
  }
`;

export const GET_USERS_WITH_CHATS = gql`
  query GetUsersWithChats {
    getUsersWithChats {
      _id
      name
      avatar
      numberOfUnseenMessages
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateMe(input: $input) {
      email
      name
      avatar
      bio
    }
  }
`;

