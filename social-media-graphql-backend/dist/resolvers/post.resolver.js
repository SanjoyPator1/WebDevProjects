import { fakePosts, fakeUsers } from "../libs/fakeData";
const postResolvers = {
    Query: {
        //all the posts of a userId
        posts: (_, __, { user }) => {
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
        feed(_, __, {}) {
            return fakePosts;
        },
    },
    Post: {
        // Field-level resolver for the 'author' field of the 'Post' type
        author: (post) => {
            // Get the author ID from the 'author' field
            const authorId = post.author;
            // Find the user object based on the author ID
            const author = fakeUsers.find((fakeUser) => fakeUser._id === authorId);
            return author;
        },
    },
    //   Mutation: {
    //     createPost: (_, { input }, { user, models }) => {
    //       const post = models.Post.createOne({ ...input, author: user.id });
    //       // pubSub.publish(NEW_POST, { newPost: post })
    //       return post;
    //     },
    //     updateMe: (_, { input }, { user, models }) => {
    //       return models.User.updateOne({ id: user.id }, input);
    //     },
    //     signup(_, { input }, { models, createToken }) {
    //       const existing = models.User.findOne({ email: input.email });
    //       if (existing) {
    //         throw new Error("nope");
    //       }
    //       const user = models.User.createOne({
    //         ...input,
    //         verified: false,
    //         avatar: "http",
    //       });
    //       const token = createToken(user);
    //       return { token, user };
    //     },
    //     signin(_, { input }, { models, createToken }) {
    //       const user = models.User.findOne(input);
    //       if (!user) {
    //         throw new Error("nope");
    //       }
    //       const token = createToken(user);
    //       return { token, user };
    //     },
    //   },
};
export default postResolvers;
