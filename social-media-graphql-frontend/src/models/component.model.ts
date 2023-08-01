// interface for entity
export interface CommentModel {
  _id: string;
  comment: string;
  date: string;
  commentOwner: {
    _id: string;
    name: string;
    avatar: string;
  };
}

export interface UserModel {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
  friendStatus : "self" | "pendingByUser" | "pendingByLoggedInUser" | "notFriend"
  posts? : PostModel[]
}

export interface PostModel {
  _id: string;
  message: string;
  createdAt: string;
  likesCount: string;
  commentsCount: string;
  isLikedByMe: boolean;
  owner: UserModel;
  comments: CommentModel[]
}

export interface FeedData {
  feed: PostModel[];
}

//nav bar model
export interface navBarObjModel {
    name : string;
    link : string;
}

export interface navBarModel {
    navBarData : navBarObjModel[];
    backgroundColor?: string;
    textColor? : string;
    onFocusTextColor? : string;
    activeTabBackgroundColor? : string;
    activeTabTextColor? : string;
}

//post model
export interface PostCardContent {
    postId: string;
    ownerAvatar: string;
    ownerName: string;
    ownerId: string;
    createdAt: string;
    postText: string;
    likesCount: string;
    commentsCount: string;
    isLikedByMe: boolean;
  }
  
  export interface PostCardComponentModel {
    data: PostCardContent;
  }

export interface CommentCardComponentModel {
    data: {
      commentId: string;
      ownerId: string;
      ownerAvatar: string;
      ownerName: string;
      createdAt: string;
      commentText: string;
    };
  }

  export interface ProfileInfoCardProps {
    profileId: string;
    avatar?: string;
    name: string;
    bio?: string;
    friendStatus:"self" | "friend" | "pendingByUser" | "pendingByLoggedInUser" | "notFriend";
    isOwnProfile?: boolean;
    displayType?: "short" | "full";
  }
  
export  interface ManyUserScrollAreaModel {
    dataProp : ProfileInfoCardProps[]
  }