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
  friendStatus:
    | "self"
    | "pendingByUser"
    | "pendingByLoggedInUser"
    | "notFriend";
  friendId: string;
  posts?: PostModel[];
}

export interface PostModel {
  _id: string;
  message: string;
  createdAt: string;
  likesCount: string;
  commentsCount: string;
  isLikedByMe: boolean;
  owner: UserModel;
  comments: CommentModel[];
}

export interface FeedData {
  feed: PostModel[];
}

//nav bar model
export interface navBarObjModel {
  name: string;
  link: string;
}

export interface navBarModel {
  navBarData: navBarObjModel[];
  backgroundColor?: string;
  textColor?: string;
  onFocusTextColor?: string;
  activeTabBackgroundColor?: string;
  activeTabTextColor?: string;
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
  friendStatus:
    | "self"
    | "friend"
    | "pendingByUser"
    | "pendingByLoggedInUser"
    | "notFriend";
  friendId: string | null;
  displayType?: "short" | "full";
  onSendFriendRequest?: (receiverId: string) => void;
  onRespondToFriendRequest?: (
    status: "accepted" | "cancelled",
    friendRequestId: string
  ) => void;
}

export interface ManyUserScrollAreaModel {
  dataProp: ProfileInfoCardProps[];
}

export interface CreatorUserModel {
  _id: string;
  name: string;
  avatar: string;
}

export interface NotificationModel {
  _id: string;
  creatorUser: CreatorUserModel;
  module: "POST" | "FRIEND_REQUEST";
  action:
    | "LIKE"
    | "COMMENT"
    | "SEND_FRIEND_REQUEST"
    | "ACCEPTED_FRIEND_REQUEST";
  linkId: string;
  createdAt: string;
  seen: boolean;
}

export interface ChatMessageModel {
  _id: string;
  sender: UserModel;
  receiver: UserModel;
  message: string;
  createdAt: string;
  seen: boolean;
}

export type MessageType = 'NEW_MESSAGE' | 'SEEN_MESSAGE';

export interface ChatMessageWithNotificationTypeModel extends ChatMessageModel {
  type?: MessageType;
}

export interface FriendModel {
  _id: string;
  name: string;
  avatar: string | undefined;
}
