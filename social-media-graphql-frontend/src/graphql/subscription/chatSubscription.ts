import { gql } from "@apollo/client";

export const NEW_MESSAGE_CHAT_SUBSCRIPTION = gql`
  subscription NEW_MESSAGE_CHAT_SUBSCRIPTION($receiverId: ID!) {
    newMessageChatSubscription(receiverId: $receiverId) {
      _id
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
      message
      createdAt
      seen
    }
  }
`;

export const SEEN_MESSAGE_CHAT_SUBSCRIPTION = gql`
  subscription SEEN_MESSAGE_CHAT_SUBSCRIPTION($receiverId: ID!) {
    seenMessageChatSubscription(receiverId: $receiverId) {
      _id
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
      message
      createdAt
      seen
    }
  }
`;

