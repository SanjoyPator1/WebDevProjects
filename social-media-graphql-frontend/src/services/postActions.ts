import { DocumentNode } from "graphql";
import client from "../graphql/apolloClient";
import { PostModel } from "../models/component.model";

// WHEN POST IS DIRECTLY OUTSIDE
// Create a post using mutation -  with optimistic ui update
export const handleCreatePost = async (
  createPost: any,
  text: string,
  MUTATION_NAME: DocumentNode,
  mutationName: string,
  cacheType: "array" | "single",
  ownerId: string,
  ownerName: string,
  ownerAvatar: string,
  variablesCachedQuery?: any,
) => {
  // Read the existing data from the cache
  const readQueryObj: { query: DocumentNode; variables?: any } = {
    query: MUTATION_NAME,
  };
  // If some variables are required for the cache query, pass them
  if (variablesCachedQuery) {
    readQueryObj.variables = variablesCachedQuery;
  }
  const cachedData = client.readQuery(readQueryObj);
  const cachedPostData = cachedData[mutationName];

  // Optimistically update the cache
  // Construct an optimistic post object with placeholder values
  const newPost = {
    _id: 'temp-post-id', // temporary ID for the optimistic update
    message: text,
    createdAt: new Date().toISOString(),
    likesCount: '0', // Placeholder value for likesCount
    commentsCount: '0', // Placeholder value for commentsCount
    isLikedByMe: false, // Placeholder value for isLikedByMe
    owner: {
      _id: ownerId, // Placeholder value for owner
      avatar: ownerAvatar && '',
      name:ownerName,
    }
  };

  let updatedNewPostData = null;

  if (cacheType === "array") {
    // Update the cache with the new post added to the beginning of the feed
    updatedNewPostData = [newPost, ...cachedPostData];
  } else {
    // Update the cache with the new post for single cache
    updatedNewPostData = newPost;
  }

  const newData: any = {};
  newData[mutationName] = updatedNewPostData;

  // Update the cache optimistically
  client.writeQuery({
    query: MUTATION_NAME,
    data: newData,
  });

  // Call the createPost mutation and pass the input variables
  const { data } = await createPost({
    variables: { input: { message: text } },
  });

  // Get the newly created post from the mutation result
  const actualNewPost = data.createPost;

  // Determine the updated data based on the cacheType
  let updatedPostData = null;

  if (cacheType === "array") {
    // Update the cache with the new post added to the beginning of the feed
    updatedPostData = [actualNewPost, ...cachedPostData];
  } else {
    // Update the cache with the new post for single cache
    updatedPostData = actualNewPost;
  }

  const updatedData: any = {};
  updatedData[mutationName] = updatedPostData;

  // Update the cache with the actual result
  client.writeQuery({
    query: MUTATION_NAME,
    data: updatedData,
  });

  // Show success toast
};

// Function to handle liking a post -  with optimistic ui update
export const handleLikePost = async (
  likePost: any,
  postId: string,
  MUTATION_NAME: DocumentNode,
  mutationName: string,
  cacheType: "array" | "single",
  variablesCachedQuery?: any,
) => {
  // Read the existing feed data from the cache
  const readQueryObj: { query: DocumentNode; variables?: any } = {
    query: MUTATION_NAME,
  };
  // If some variables are required for the cache query, pass them
  if (variablesCachedQuery) {
    readQueryObj.variables = variablesCachedQuery;
  }

  const cachedData = client.readQuery(readQueryObj);
  const cachedPostData = cachedData[mutationName];

  // Optimistically update the cache
  let optimisticPostData = null;
  if (cacheType === "array") {
    optimisticPostData = cachedPostData.map((post: PostModel) =>
      post._id === postId
        ? {
            ...post,
            likesCount: (parseInt(post.likesCount) + 1).toString(),
            isLikedByMe: true,
          }
        : post
    );
  } else {
    optimisticPostData = {
      ...cachedPostData,
      likesCount: (parseInt(cachedPostData.likesCount) + 1).toString(),
      isLikedByMe: true,
    };
  }

  const newData: any = {};
  newData[mutationName] = optimisticPostData;

  // Update the cache optimistically
  client.writeQuery({
    query: MUTATION_NAME,
    data: newData,
  });

  // Call the likePost mutation and pass the postId as input variable
  const { data: likedPostData } = await likePost({
    variables: { input: { postId } },
  });

  // Get the postId returned from the mutation result
  const likedPostId = likedPostData.likePost.postId;

  // Update the cache with the actual mutation result
  let updatedPostData = null;
  if (cacheType === "array") {
    updatedPostData = cachedPostData.map((post: PostModel) =>
      post._id === likedPostId
        ? {
            ...post,
            likesCount: (parseInt(post.likesCount) + 1).toString(),
            isLikedByMe: true,
          }
        : post
    );
  } else {
    updatedPostData = {
      ...cachedPostData,
      likesCount: (parseInt(cachedPostData.likesCount) + 1).toString(),
      isLikedByMe: true,
    };
  }

  const updatedData: any = {};
  updatedData[mutationName] = updatedPostData;

  // Update the cache with the actual result
  client.writeQuery({
    query: MUTATION_NAME,
    data: updatedData,
  });
};

// Function to handle unlike a post -  with optimistic ui update
export const handleUnlikePost = async (
  unlikePost: any,
  postId: string,
  MUTATION_NAME: DocumentNode,
  mutationName: string,
  cacheType: "array" | "single",
  variablesCachedQuery?: any,
) => {
  // Read the existing data from the cache
  const readQueryObj: { query: DocumentNode; variables?: any } = {
    query: MUTATION_NAME,
  };
  // If some variables are required for the cache query, pass them
  if (variablesCachedQuery) {
    readQueryObj.variables = variablesCachedQuery;
  }

  const cachedData = client.readQuery(readQueryObj);
  const cachedPostData = cachedData[mutationName];

  // Optimistically update the cache
  let optimisticPostData = null;
  if (cacheType === "array") {
    optimisticPostData = cachedPostData.map((post: PostModel) =>
      post._id === postId
        ? {
            ...post,
            likesCount: (parseInt(post.likesCount) - 1).toString(),
            isLikedByMe: false,
          }
        : post
    );
  } else {
    optimisticPostData = {
      ...cachedPostData,
      likesCount: (parseInt(cachedPostData.likesCount) - 1).toString(),
      isLikedByMe: false,
    };
  }

  const newData: any = {};
  newData[mutationName] = optimisticPostData;

  // Update the cache optimistically
  client.writeQuery({
    query: MUTATION_NAME,
    data: newData,
  });

  // Call the unlikePost mutation and pass the input variables
  await unlikePost({
    variables: { input: { postId } },
  });

  // Update the cache with the actual mutation result
  let updatedPostData = null;
  if (cacheType === "array") {
    updatedPostData = cachedPostData.map((post: PostModel) =>
      post._id === postId
        ? {
            ...post,
            likesCount: (parseInt(post.likesCount) - 1).toString(),
            isLikedByMe: false,
          }
        : post
    );
  } else {
    updatedPostData = {
      ...cachedPostData,
      likesCount: (parseInt(cachedPostData.likesCount) - 1).toString(),
      isLikedByMe: false,
    };
  }

  const updatedData: any = {};
  updatedData[mutationName] = updatedPostData;

  // Update the cache with the actual result
  client.writeQuery({
    query: MUTATION_NAME,
    data: updatedData,
  });
};
  
// Function to add a comment -  with optimistic ui update
export const handleAddComment = async (
  addComment: any,
  postId: string,
  commentText: string,
  MUTATION_NAME: DocumentNode,
  mutationName: string,
  cacheType: "array" | "single",
  variablesCachedQuery?: any
) => {
  // Read the existing data from the cache
  const readQueryObj: { query: DocumentNode; variables?: any } = {
    query: MUTATION_NAME,
  };
  // If some variables are required for the cache query, pass them
  if (variablesCachedQuery) {
    readQueryObj.variables = variablesCachedQuery;
  }
  const cachedData = client.readQuery(readQueryObj);
  const cachedPostData = cachedData[mutationName];

  // Optimistically update the cache
  const newComment = {
    _id: 'temp-comment-id', //temporary ID for the optimistic update
    text: commentText,
    createdAt: new Date().toISOString(),
  };

  let updatedNewCommentsData = null;

  if (cacheType === "array") {
    // Update the cache with the new comment added to the beginning of the comments array
    updatedNewCommentsData = [newComment, ...cachedPostData.comments];
  } else {
    // Update the cache with the new comment for single cache
    updatedNewCommentsData = [...cachedPostData.comments, newComment];
  }

  const newData: any = {};
  newData[mutationName] = {
    ...cachedPostData,
    comments: updatedNewCommentsData,
  };

  // Update the cache optimistically
  client.writeQuery({
    query: MUTATION_NAME,
    data: newData,
  });

  // Call the addComment mutation and pass the postId and comment text as input variables
  const { data } = await addComment({
    variables: {
      postId,
      comment: commentText,
    },
  });

  // Get the new comment from the mutation result
  const actualNewComment = data.addComment;

  // Determine the updated data based on the cacheType
  let updatedCommentsData = null;

  if (cacheType === "array") {
    // Update the cache with the new comment added to the beginning of the comments array
    updatedCommentsData = [actualNewComment, ...cachedPostData.comments];
  } else {
    // Update the cache with the new comment for single cache
    updatedCommentsData = [...cachedPostData.comments, actualNewComment];
  }

  const updatedData: any = {};
  updatedData[mutationName] = {
    ...cachedPostData,
    comments: updatedCommentsData,
  };

  // Update the cache with the actual result
  client.writeQuery({
    query: MUTATION_NAME,
    data: updatedData,
  });
};

//WHEN POST IS IN PROFILE
// Function to handle creating a new post -  with optimistic ui update
export const handleCreatePostFromProfile = async (
  createPost: any,
  text: string,
  MUTATION_NAME: DocumentNode,
  cacheType: 'array' | 'single',
  ownerId: string,
  ownerName: string,
  ownerAvatar: string,
  variablesCachedQuery?: any
) => {
  // Construct an optimistic post object with placeholder values
  const newPost = {
    _id: 'temp-post-id', // temporary ID for the optimistic update
    message: text,
    createdAt: new Date().toISOString(),
    likesCount: '0', // Placeholder value for likesCount
    commentsCount: '0', // Placeholder value for commentsCount
    isLikedByMe: false, // Placeholder value for isLikedByMe
    owner: {
      _id: ownerId,
      avatar: ownerAvatar && '',
      name: ownerName,
    }
  };

  // Read the existing data from the cache
  const readQueryObj: { query: DocumentNode; variables?: any } = {
    query: MUTATION_NAME,
  };
  // If some variables are required for the cache query, pass them
  if (variablesCachedQuery) {
    readQueryObj.variables = variablesCachedQuery;
  }
  const cachedData = client.readQuery(readQueryObj);

  // Determine the target data based on the cacheType
  let targetData;
  if (cacheType === 'array') {
    // Array type cache (e.g., findUser.posts)
    targetData = [newPost, ...cachedData.findUser.posts];
  } else if (cacheType === 'single') {
    // Single type cache (e.g., feed)
    targetData = newPost;
  } else {
    throw new Error('Invalid cacheType');
  }

  // Construct the updated data object using the cache path
  const newData: any = {
    ...cachedData,
    findUser: {
      ...cachedData.findUser,
      posts: targetData,
    },
  };

  // Update the cache optimistically
  client.writeQuery({
    query: MUTATION_NAME,
    data: newData,
  });

    // Call the createPost mutation and pass the input variables
    const { data } = await createPost({
      variables: { input: { message: text } },
    });

    // Get the newly created post from the mutation result
    const actualNewPost = data.createPost;

    // Determine the updated data based on the cacheType
    let updatedPostData = null;

    if (cacheType === 'array') {
      // Array type cache (e.g., findUser.posts)
      updatedPostData = [actualNewPost, ...cachedData.findUser.posts];
    } else if (cacheType === 'single') {
      // Single type cache (e.g., feed)
      updatedPostData = actualNewPost;
    } else {
      throw new Error('Invalid cacheType');
    }

    // Construct the updated data object using the cache path
    const updatedData: any = {
      ...cachedData,
      findUser: {
        ...cachedData.findUser,
        posts: updatedPostData,
      },
    };

    // Update the cache with the actual result
    client.writeQuery({
      query: MUTATION_NAME,
      data: updatedData,
    });
 
};


//Function to handle like from profile -  with optimistic ui update
export const handleLikePostFromProfile = async (
  likePost: any,
  postId: string,
  MUTATION_NAME: DocumentNode,
  cacheType: 'array' | 'single',
  variablesCachedQuery?: any,
) => {
  // Read the existing data from the cache
  const readQueryObj: { query: DocumentNode; variables?: any } = {
    query: MUTATION_NAME,
  };
  // If some variables are required for the cache query, pass them
  if (variablesCachedQuery) {
    readQueryObj.variables = variablesCachedQuery;
  }
  const cachedData = client.readQuery(readQueryObj);

  // Get the posts from cacheData
  const cachedPosts = cachedData.findUser.posts;

  // Optimistically update the cache
  let optimisticPosts = null;
  if (cacheType === 'array') {
    // Array type cache (e.g., findUser.posts)
    optimisticPosts = cachedPosts.map((post: any) =>
      post._id === postId
        ? {
            ...post,
            likesCount: (parseInt(post.likesCount) + 1).toString(),
            isLikedByMe: true,
          }
        : post
    );
  } else if (cacheType === 'single') {
    // Single type cache (e.g., feed)
    optimisticPosts = {
      ...cachedData.findUser,
      likesCount: (parseInt(cachedData.findUser.likesCount) + 1).toString(),
      isLikedByMe: true,
    };
  } else {
    throw new Error('Invalid cacheType');
  }

  const newData: any = {
    ...cachedData,
    findUser: {
      ...cachedData.findUser,
      posts: optimisticPosts,
    },
  };

  // Update the cache optimistically
  client.writeQuery({
    query: MUTATION_NAME,
    data: newData,
  });

  // Call the likePost mutation and pass the input variables
  const { data: likedPostData } = await likePost({
    variables: { input: { postId } },
  });

  // Get the postId returned from the mutation result
  const likedPostId = likedPostData.likePost.postId;

  // Construct the updated data object using the cache path
  let updatedPosts = null;
  if (cacheType === 'array') {
    // Array type cache (e.g., findUser.posts)
    updatedPosts = cachedPosts.map((post: any) =>
      post._id === likedPostId
        ? {
            ...post,
            likesCount: (parseInt(post.likesCount) + 1).toString(),
            isLikedByMe: true,
          }
        : post
    );
  } else if (cacheType === 'single') {
    // Single type cache (e.g., feed)
    updatedPosts = {
      ...cachedData.findUser,
      likesCount: (parseInt(cachedData.findUser.likesCount) + 1).toString(),
      isLikedByMe: true,
    };
  } else {
    throw new Error('Invalid cacheType');
  }

  const updatedData: any = {
    ...cachedData,
    findUser: {
      ...cachedData.findUser,
      posts: updatedPosts,
    },
  };

  // Update the cache with the actual result
  client.writeQuery({
    query: MUTATION_NAME,
    data: updatedData,
  });
};

// Function to handle unlike a post -  with optimistic ui update
export const handleUnlikePostFromProfile = async (
  unlikePost: any,
  postId: string,
  MUTATION_NAME: DocumentNode,
  cacheType: 'array' | 'single',
  variablesCachedQuery?: any
) => {
  // Read the existing data from the cache
  const readQueryObj: { query: DocumentNode; variables?: any } = {
    query: MUTATION_NAME,
  };
  // If some variables are required for the cache query, pass them
  if (variablesCachedQuery) {
    readQueryObj.variables = variablesCachedQuery;
  }
  const cachedData = client.readQuery(readQueryObj);

  // Get the posts from cacheData
  const cachedPosts = cachedData.findUser.posts;

  // Optimistically update the cache
  let optimisticPosts = null;
  if (cacheType === 'array') {
    // Array type cache (e.g., findUser.posts)
    optimisticPosts = cachedPosts.map((post: any) =>
      post._id === postId
        ? {
            ...post,
            likesCount: (parseInt(post.likesCount) - 1).toString(),
            isLikedByMe: false,
          }
        : post
    );
  } else if (cacheType === 'single') {
    // Single type cache (e.g., feed)
    optimisticPosts = {
      ...cachedData.findUser,
      likesCount: (parseInt(cachedData.findUser.likesCount) - 1).toString(),
      isLikedByMe: false,
    };
  } else {
    throw new Error('Invalid cacheType');
  }

  const newData: any = {
    ...cachedData,
    findUser: {
      ...cachedData.findUser,
      posts: optimisticPosts,
    },
  };

  // Update the cache optimistically
  client.writeQuery({
    query: MUTATION_NAME,
    data: newData,
  });

  // Call the unlikePost mutation and pass the postId as an input variable
  await unlikePost({
    variables: { input: { postId } },
  });

  // Determine the updated data based on the cacheType
  let updatedPosts = null;
  if (cacheType === 'array') {
    // Array type cache (e.g., findUser.posts)
    updatedPosts = cachedPosts.map((post: any) =>
      post._id === postId
        ? {
            ...post,
            likesCount: (parseInt(post.likesCount) - 1).toString(),
            isLikedByMe: false,
          }
        : post
    );
  } else if (cacheType === 'single') {
    // Single type cache (e.g., feed)
    updatedPosts = {
      ...cachedData.findUser,
      likesCount: (parseInt(cachedData.findUser.likesCount) - 1).toString(),
      isLikedByMe: false,
    };
  } else {
    throw new Error('Invalid cacheType');
  }

  const updatedData: any = {
    ...cachedData,
    findUser: {
      ...cachedData.findUser,
      posts: updatedPosts,
    },
  };

  // Update the cache with the actual result
  client.writeQuery({
    query: MUTATION_NAME,
    data: updatedData,
  });
};



