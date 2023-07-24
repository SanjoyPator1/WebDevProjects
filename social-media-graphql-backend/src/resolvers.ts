import { fakePosts, fakeUsers } from "./libs/fakeData";

const resolvers = {
  Query: {
    //User details of the logged in user
    me: (_, __, { user }) => {
      console.log("me resolver ");
      console.log({ user });
      return fakeUsers[0];
    },
    //all the posts of a userId
    posts: (_, __, { user, models }) => {
      const userPosts = fakePosts.filter((post) => post.author === user.id);
      return userPosts;
    },

    //post of a particular post id
    post: (_, { id }) => {
      const post = fakePosts.find((post) => post.id === id);

      if (!post) {
        throw new Error(`Post with ID ${id} not found`);
      }

      return post;
    },

    // all the posts of the social-network
    feed(_, __, { models }) {
      return fakePosts;
    },
  },
  User: {
    // Field-level resolver for the 'friends' field of the 'User' type
    friends: (user) => {
      // Get the IDs of the user's friends from the 'friends' field
      const friendIds = user.friends;

      // Find the friend objects based on their IDs
      const friends = fakeUsers.filter((fakeUser) =>
        friendIds.includes(fakeUser.id)
      );

      return friends;
    },
  },
  Post: {
    // Field-level resolver for the 'author' field of the 'Post' type
    author: (post) => {
      // Get the author ID from the 'author' field
      const authorId = post.author;

      // Find the user object based on the author ID
      const author = fakeUsers.find((fakeUser) => fakeUser.id === authorId);

      return author;
    },
    // ... other field-level resolvers for the 'Post' type ...
  },
};

export default resolvers;
