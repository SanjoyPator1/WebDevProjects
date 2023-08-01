import { DocumentNode } from "graphql";
import client from "../graphql/apolloClient";
import { PostModel } from "../models/component.model";

// WHEN POST IS DIRECTLY OUTSIDE
// Create a post using mutation
export const handleCreatePost = async (
    createPost: any,
    text: string,
    MUTATION_NAME: DocumentNode,
    mutationName: string,
    cacheType: "array" | "single",
    variablesCachedQuery?: any
  ) => {
    // Call the createPost mutation and pass the input variables
    const { data } = await createPost({
      variables: { input: { message: text } },
    });
  
    // Get the newly created post from the mutation result
    const newPost = data.createPost;
  
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
  
    // Update the cache with the updated data
    client.writeQuery({
      query: MUTATION_NAME,
      data: newData,
    });
  
    // Show success toast and also do optimistic UI
  };

// Function to handle liking a post
export const handleLikePost = async (
  likePost: any,
  postId: string,
  MUTATION_NAME: DocumentNode,
  mutationName: string,
  cacheType: "array" | "single",
  variablesCachedQuery?: any
) => {
  // Call the likePost mutation and pass the postId as input variable
  const { data: LikedPostData } = await likePost({
    variables: { input: { postId } },
  });

  // Get the postId returned from the mutation result
  const likedPostId = LikedPostData.likePost.postId;

  // Read the existing feed data from the cache
  const readQueryObj: { query: DocumentNode; variables?: any } = {
    query: MUTATION_NAME,
  };
  //if some variables are required for the cache query pass it
  if (variablesCachedQuery) {
    readQueryObj.variables = variablesCachedQuery;
  }
  const cachedData = client.readQuery(readQueryObj);
  const cachedPostData = cachedData[mutationName];

  let updatedNewPostData = null;

  if (cacheType === "array") {
    // Update the cache to set isLikedByMe to true for the liked post and also increase like count
    updatedNewPostData = cachedPostData.map((post: PostModel) =>
      post._id === likedPostId
        ? {
            ...post,
            likesCount: (parseInt(post.likesCount) + 1).toString(),
            isLikedByMe: true,
          }
        : post
    );
  } else {
    updatedNewPostData = {
      ...cachedPostData,
      likesCount: (parseInt(cachedPostData.likesCount) + 1).toString(),
      isLikedByMe: true,
    };
  }

  const newData: any = {};
  newData[mutationName] = updatedNewPostData;

  // Update the cache with the updated feed data
  client.writeQuery({
    query: MUTATION_NAME,
    data: newData,
  });
};

// Function to handle unlike a post
export const handleUnlikePost = async (
    unlikePost: any,
    postId: string,
    MUTATION_NAME: DocumentNode,
    mutationName: string,
    cacheType: "array" | "single",
    variablesCachedQuery?: any
  ) => {
    // Call the unlikePost mutation and pass the input variables
    await unlikePost({
      variables: { input: { postId } },
    });
  
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
  
    let updatedNewPostData = null;
  
    if (cacheType === "array") {
      // Update the cache to set isLikedByMe to false for the unliked post and decrease like count
      updatedNewPostData = cachedPostData.map((post: PostModel) =>
        post._id === postId
          ? {
              ...post,
              likesCount: (parseInt(post.likesCount) - 1).toString(),
              isLikedByMe: false,
            }
          : post
      );
    } else {
      updatedNewPostData = {
        ...cachedPostData,
        likesCount: (parseInt(cachedPostData.likesCount) - 1).toString(),
        isLikedByMe: false,
      };
    }
  
    const newData: any = {};
    newData[mutationName] = updatedNewPostData;
  
    // Update the cache with the updated data
    client.writeQuery({
      query: MUTATION_NAME,
      data: newData,
    });
  };
  
// Function to add a comment
export const handleAddComment = async (
    addComment: any,
    postId: string,
    commentText: string,
    MUTATION_NAME: DocumentNode,
    mutationName: string,
    cacheType: "array" | "single",
    variablesCachedQuery?: any,
  ) => {
    // Call the addComment mutation and pass the postId and comment text as input variables
    const { data } = await addComment({
      variables: {
        postId,
        comment: commentText,
      },
    });
  
    // Get the new comment from the mutation result
    const newComment = data.addComment;
  
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
  
    let updatedNewCommentsData = null;
  
    if (cacheType === "array") {
      // Update the cache with the new comment added to the beginning of the comments array
      //TODO: write the logic later. This feature has not been implemented till now
    //   updatedNewCommentsData = [...cachedPostData.comments, newComment];
    } else {
      // Update the cache with the new comment for single cache
      updatedNewCommentsData = [...cachedPostData.comments,newComment];
    }
  
    const newData: any = {};
    newData[mutationName] = {
      ...cachedPostData,
      comments: updatedNewCommentsData,
    };
  
    // Update the cache with the updated data
    client.writeQuery({
      query: MUTATION_NAME,
      data: newData,
    });
  };

//WHEN POST IS IN PROFILE
// Function to handle creating a new post
export const handleCreatePostFromProfile = async (
  createPost: any,
  text: string,
  MUTATION_NAME: DocumentNode,
  cacheType: 'array' | 'single',
  variablesCachedQuery?: any
) => {
  // Call the createPost mutation and pass the input variables
  const { data } = await createPost({
    variables: { input: { message: text } },
  });

  // Get the newly created post from the mutation result
  const newPost = data.createPost;

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

  // Update the cache with the updated data
  client.writeQuery({
    query: MUTATION_NAME,
    data: newData,
  });
};

//Function to handle like from profile
export const handleLikePostFromProfile = async (
  likePost: any,
  postId: string,
  MUTATION_NAME: DocumentNode,
  cacheType: 'array' | 'single',
  variablesCachedQuery?: any
) => {
  // Call the likePost mutation and pass the postId as an input variable
  const { data: likedPostData } = await likePost({
    variables: { input: { postId } },
  });

  // Get the postId returned from the mutation result
  const likedPostId = likedPostData.likePost.postId;

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

  // Determine the target data based on the cacheType
  let targetData;
  if (cacheType === 'array') {
    // Array type cache (e.g., findUser.posts)
    targetData = cachedPosts.map((post: any) =>
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
    targetData = {
      ...cachedData.findUser,
      likesCount: (parseInt(cachedData.findUser.likesCount) + 1).toString(),
      isLikedByMe: true,
    };
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

  // Update the cache with the updated data
  client.writeQuery({
    query: MUTATION_NAME,
    data: newData,
  });
};

// Function to handle unlike a post
export const handleUnlikePostFromProfile = async (
  unlikePost: any,
  postId: string,
  MUTATION_NAME: DocumentNode,
  cacheType: 'array' | 'single',
  variablesCachedQuery?: any
) => {
  // Call the unlikePost mutation and pass the postId as an input variable
  await unlikePost({
    variables: { input: { postId } },
  });

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

  // Determine the target data based on the cacheType
  let targetData;
  if (cacheType === 'array') {
    // Array type cache (e.g., findUser.posts)
    targetData = cachedPosts.map((post: any) =>
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
    targetData = {
      ...cachedData.findUser,
      likesCount: (parseInt(cachedData.findUser.likesCount) - 1).toString(),
      isLikedByMe: false,
    };
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

  // Update the cache with the updated data
  client.writeQuery({
    query: MUTATION_NAME,
    data: newData,
  });
};


