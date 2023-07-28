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
  query GetPostById($id: ID!) {
    post(id: $id) {
      _id
      message
      ownerId
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

export const GET_FEED = gql`
  query GetFeed {
    feed {
      _id
      message
      ownerId
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