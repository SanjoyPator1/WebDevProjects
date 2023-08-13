import gql from 'graphql-tag';

export const GET_MESSAGES_BY_RECEIVER_ID = gql`
  query GetMessagesByReceiverId($userId: ID!) {
    getMessages(userId: $userId) {
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
