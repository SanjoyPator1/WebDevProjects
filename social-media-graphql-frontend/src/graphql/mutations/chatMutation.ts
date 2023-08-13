import gql from "graphql-tag";

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
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

export const MARK_MESSAGES_AS_SEEN = gql`
  mutation MarkMessagesAsSeen($input: MarkAsSeenInput!) {
    markAsSeen(input: $input) {
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



  
