// src/graphql/mutations/userMutations.ts
import { gql } from "@apollo/client";

export const UPDATE_ME = gql`
  mutation UpdateMe($input: UpdateUserInput!) {
    updateMe(input: $input) {
      _id
      email
      name
      avatar
    }
  }
`;

export const SIGNUP = gql`
  mutation signUp($input: SignupInput!) {
    signup(input: $input) {
      _id
      email
      name
      avatar
      createdAt
      bio
      role
      userJwtToken
    }
  }
`;

export const SIGNIN = gql`
  mutation signIn($input: SigninInput!) {
    signin(input: $input) {
      _id
      email
      name
      avatar
      createdAt
      bio
      role
      userJwtToken
    }
  }
`;

export const GOOGLE_AUTH = gql`
  mutation googleAuth($input: GoogleAuthInput!) {
    googleAuth(input: $input) {
      _id
      email
      name
      avatar
      createdAt
      role
      bio
      userJwtToken
    }
  }
`;

export const SEND_FRIEND_REQUEST = gql`
  mutation SEND_FRIEND_REQUEST($receiverId: ID!) {
    sendFriendRequest(input: { receiverId: $receiverId }) {
      id
      createdAt
      status
      senderId
      receiverId
    }
  }
`;

export const RESPOND_TO_FRIEND_REQUEST = gql`
  mutation RESPOND_TO_FRIEND_REQUEST($friendRequestId: ID!, $status: String!) {
    respondToFriendRequest(
      input: { friendRequestId: $friendRequestId, status: $status }
    ) {
      id
      createdAt
      status
      senderId
      receiverId
    }
  }
`;
