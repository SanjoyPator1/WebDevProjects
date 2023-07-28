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
      role
      userJwtToken
    }
  }
`;

export const SEND_FRIEND_REQUEST = gql`
  mutation SendFriendRequest($input: SendFriendRequestInput!) {
    sendFriendRequest(input: $input) {
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

export const RESPOND_TO_FRIEND_REQUEST = gql`
  mutation RespondToFriendRequest($input: RespondToFriendRequestInput!) {
    respondToFriendRequest(input: $input) {
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