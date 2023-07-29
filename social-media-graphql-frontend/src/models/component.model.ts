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
export interface PostCardContent{
    postId: string;
    ownerAvatar: string;
    ownerName: string;
    createdAt: string;
    postText: string;
    likesCount: string;
    commentsCount: string;
    isLikedByMe: boolean;
}

export interface PostCardComponentModel{
    data: PostCardContent
}