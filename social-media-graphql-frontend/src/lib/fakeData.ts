import { CommentCardComponentModel } from "../models/component.model";

// Fake data for the component
export const fakeProfileInfoData = [
  {
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/191112_%EC%A0%84%EC%A7%80%ED%98%84.jpg/640px-191112_%EC%A0%84%EC%A7%80%ED%98%84.jpg",
    name: "John Doe",
    friendStatus: "not_friend", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et ultrices elit. Nullam auctor volutpat felis, vel tincidunt nisl convallis nec.",
  },
  {
    avatar: "https://example.com/avatar2.jpg",
    name: "Jane Smith",
    friendStatus: "friend", // Possible values: "friend", "request_sent", "not_friend"
    bio: "I'm a software developer and a passionate learner. Love coding and building new things!",
  },
  {
    avatar: "https://example.com/avatar3.jpg",
    name: "Michael Johnson",
    friendStatus: "request_sent", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Photographer by profession, capturing moments that last a lifetime.",
  },
  {
    avatar: "https://example.com/avatar4.jpg",
    name: "Emily Brown",
    friendStatus: "not_friend", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Nature lover and traveler. Exploring the world one place at a time!",
  },
  {
    avatar: "https://example.com/avatar5.jpg",
    name: "David Lee",
    friendStatus: "friend", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Avid reader, book lover, and aspiring writer. Let words take you on a journey!",
  },
  {
    avatar: "https://example.com/avatar6.jpg",
    name: "Sarah Adams",
    friendStatus: "request_sent", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Adventurer and adrenaline junkie. Always seeking the thrill of new experiences.",
  },
  {
    avatar: "https://example.com/avatar7.jpg",
    name: "Michael Johnson Jr.",
    friendStatus: "not_friend", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Tech enthusiast and gamer. Building cool stuff with code and conquering virtual worlds.",
  },
  {
    avatar: "https://example.com/avatar8.jpg",
    name: "Emma Wilson",
    friendStatus: "friend", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Designer with a passion for aesthetics and creating visually stunning experiences.",
  },
  {
    avatar: "https://example.com/avatar9.jpg",
    name: "James Davis",
    friendStatus: "not_friend", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Musician and music producer. Let the rhythm guide your soul.",
  },
  {
    avatar: "https://example.com/avatar10.jpg",
    name: "Olivia Clark",
    friendStatus: "friend", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Animal lover and animal rights advocate. Making the world a better place for all creatures.",
  },
  {
    avatar: "https://example.com/avatar11.jpg",
    name: "William Rodriguez",
    friendStatus: "not_friend", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Entrepreneur and startup enthusiast. Dream big, start small, and achieve greatness.",
  },
  {
    avatar: "https://example.com/avatar12.jpg",
    name: "Ava Martinez",
    friendStatus: "request_sent", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Film buff and cinephile. Exploring the art of storytelling through the magic of cinema.",
  },
  {
    avatar: "https://example.com/avatar13.jpg",
    name: "Noah Wright",
    friendStatus: "not_friend", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Sports enthusiast and fitness freak. Push your limits and conquer the challenges.",
  },
  {
    avatar: "https://example.com/avatar14.jpg",
    name: "Mia Moore",
    friendStatus: "friend", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Foodie and cooking enthusiast. Savoring the taste of life, one recipe at a time.",
  },
  {
    avatar: "https://example.com/avatar15.jpg",
    name: "Ethan Turner",
    friendStatus: "not_friend", // Possible values: "friend", "request_sent", "not_friend"
    bio: "Artist and painter. Discovering the world's beauty and expressing it on canvas.",
  },
];


export const fakePostData = [
  {
    postId: "1",
    ownerId: "64c35b98b8802f9a879e2730",
    ownerAvatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/191112_%EC%A0%84%EC%A7%80%ED%98%84.jpg/640px-191112_%EC%A0%84%EC%A7%80%ED%98%84.jpg",
    ownerName: "John Doe",
    createdAt: "2023-07-29 10:30:00",
    postText: "This is the first post. Hello, everyone!",
    likesCount: "15",
    commentsCount: "8",
    isLikedByMe: false,
  },
  {
    postId: "2",
    ownerId: "user2",
    ownerAvatar:
      "https://cdn.i-scmp.com/sites/default/files/styles/1200x800/public/d8/images/canvas/2021/12/02/25e2a489-5a74-42db-b131-2bffdf48b208_9cf947d5.jpg?itok=DUyX1w6u&v=1638433496",
    ownerName: "Jane Smith",
    createdAt: "2022-07-29 11:45:00",
    postText: "Second post here. Loving this social media project!",
    likesCount: "20",
    commentsCount: "12",
    isLikedByMe: true,
  },
  {
    postId: "3",
    ownerId: "user3",
    ownerAvatar: "https://example.com/avatar3.jpg",
    ownerName: "Michael Johnson Junior",
    createdAt: "2022-07-29 15:20:00",
    postText: "Another post. Having a great day!",
    likesCount: "8",
    commentsCount: "3",
    isLikedByMe: false,
  },
  {
    postId: "4",
    ownerId: "user4",
    ownerAvatar: "https://example.com/avatar4.jpg",
    ownerName: "Emily Brown",
    createdAt: "2022-07-29 18:00:00",
    postText: "Just a random thought...",
    likesCount: "5",
    commentsCount: "2",
    isLikedByMe: true,
  },
  {
    postId: "5",
    ownerId: "user5",
    ownerAvatar: "https://example.com/avatar5.jpg",
    ownerName: "David Lee",
    createdAt: "2022-07-29 21:12:00",
    postText: "Hello, world!",
    likesCount: "12",
    commentsCount: "6",
    isLikedByMe: false,
  },
  {
    postId: "6",
    ownerId: "user6",
    ownerAvatar: "https://example.com/avatar6.jpg",
    ownerName: "Sarah Adams",
    createdAt: "2022-07-29 23:45:00",
    postText: "Late-night thoughts...",
    likesCount: "9",
    commentsCount: "4",
    isLikedByMe: true,
  },
  {
    postId: "7",
    ownerId: "user7",
    ownerAvatar: "https://example.com/avatar7.jpg",
    ownerName: "Michael Johnson",
    createdAt: "2022-07-30 08:30:00",
    postText: "New day, new post!",
    likesCount: "11",
    commentsCount: "5",
    isLikedByMe: false,
  },
  {
    postId: "8",
    ownerId: "user8",
    ownerAvatar: "https://example.com/avatar8.jpg",
    ownerName: "Emma Wilson",
    createdAt: "2022-07-30 11:15:00",
    postText: "Feeling great today!",
    likesCount: "18",
    commentsCount: "9",
    isLikedByMe: true,
  },
  {
    postId: "9",
    ownerId: "user9",
    ownerAvatar: "https://example.com/avatar9.jpg",
    ownerName: "James Davis",
    createdAt: "2022-07-30 14:20:00",
    postText: "Just a test post!",
    likesCount: "3",
    commentsCount: "1",
    isLikedByMe: false,
  },
  {
    postId: "10",
    ownerId: "user10",
    ownerAvatar: "https://example.com/avatar10.jpg",
    ownerName: "Olivia Clark",
    createdAt: "2022-07-30 16:45:00",
    postText: "Feeling inspired!",
    likesCount: "6",
    commentsCount: "3",
    isLikedByMe: true,
  },
  {
    postId: "11",
    ownerId: "user11",
    ownerAvatar: "https://example.com/avatar11.jpg",
    ownerName: "William Rodriguez",
    createdAt: "2022-07-30 19:30:00",
    postText: "Sharing some thoughts...",
    likesCount: "7",
    commentsCount: "2",
    isLikedByMe: false,
  },
  {
    postId: "12",
    ownerId: "user12",
    ownerAvatar: "https://example.com/avatar12.jpg",
    ownerName: "Ava Martinez",
    createdAt: "2022-07-30 22:10:00",
    postText: "Time to unwind...",
    likesCount: "10",
    commentsCount: "4",
    isLikedByMe: true,
  },
  {
    postId: "13",
    ownerId: "user13",
    ownerAvatar: "https://example.com/avatar13.jpg",
    ownerName: "Noah Wright",
    createdAt: "2022-07-31 09:15:00",
    postText: "Greetings, fellow users!",
    likesCount: "14",
    commentsCount: "6",
    isLikedByMe: false,
  },
  {
    postId: "14",
    ownerId: "user14",
    ownerAvatar: "https://example.com/avatar14.jpg",
    ownerName: "Mia Moore",
    createdAt: "2023-07-31 12:30:00",
    postText: "A wonderful day!",
    likesCount: "22",
    commentsCount: "10",
    isLikedByMe: true,
  },
  {
    postId: "15",
    ownerId: "user15",
    ownerAvatar: "https://example.com/avatar15.jpg",
    ownerName: "Ethan Turner",
    createdAt: "2023-07-31 15:40:00",
    postText: "Checking out this social media project!",
    likesCount: "9",
    commentsCount: "4",
    isLikedByMe: false,
  },
  {
    postId: "16",
    ownerId: "user16",
    ownerAvatar: "https://example.com/avatar16.jpg",
    ownerName: "Sophia Walker",
    createdAt: "2023-07-31 18:20:00",
    postText: "Hello, everyone! How are you?",
    likesCount: "11",
    commentsCount: "5",
    isLikedByMe: true,
  },
  {
    postId: "17",
    ownerId: "user17",
    ownerAvatar: "https://example.com/avatar17.jpg",
    ownerName: "Liam Perez",
    createdAt: "2023-07-31 21:00:00",
    postText: "Time for some fun!",
    likesCount: "8",
    commentsCount: "3",
    isLikedByMe: false,
  },
  {
    postId: "18",
    ownerId: "user18",
    ownerAvatar: "https://example.com/avatar18.jpg",
    ownerName: "Isabella Scott",
    createdAt: "2023-07-31 23:45:00",
    postText: "Late-night post!",
    likesCount: "12",
    commentsCount: "6",
    isLikedByMe: true,
  },
  {
    postId: "19",
    ownerId: "user19",
    ownerAvatar: "https://example.com/avatar19.jpg",
    ownerName: "Logan Price",
    createdAt: "2023-08-01 10:00:00",
    postText: "Having a great start to the day!",
    likesCount: "16",
    commentsCount: "7",
    isLikedByMe: false,
  },
  {
    postId: "20",
    ownerId: "user20",
    ownerAvatar: "https://example.com/avatar20.jpg",
    ownerName: "Abigail Evans",
    createdAt: "2023-08-01 12:30:00",
    postText: "Posting a random picture. Enjoy!",
    likesCount: "25",
    commentsCount: "13",
    isLikedByMe: true,
  },
];

export const fakeCommentData: CommentCardComponentModel[] = [
  {
    data: {
      commentId: "1",
      ownerId: "user1",
      ownerAvatar: "https://cdn.i-scmp.com/sites/default/files/styles/1200x800/public/d8/images/canvas/2021/12/02/25e2a489-5a74-42db-b131-2bffdf48b208_9cf947d5.jpg?itok=DUyX1w6u&v=1638433496",
      ownerName: "Commenter 1",
      createdAt: "2023-07-29 11:00:00",
      commentText: "This is the first comment on Post 1.",
    },
  },
  {
    data: {
      commentId: "2",
      ownerId: "user2",
      ownerAvatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/191112_%EC%A0%84%EC%A7%80%ED%98%84.jpg/640px-191112_%EC%A0%84%EC%A7%80%ED%98%84.jpg",
      ownerName: "Commenter 2",
      createdAt: "2023-07-29 12:30:00",
      commentText: "Second comment on Post 1! \n Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
  },
  {
    data: {
      commentId: "3",
      ownerId: "user3",
      ownerAvatar: "https://example.com/avatar3.jpg",
      ownerName: "Commenter 3",
      createdAt: "2023-07-29 14:15:00",
      commentText: "Another comment here.",
    },
  },
  {
    data: {
      commentId: "4",
      ownerId: "user4",
      ownerAvatar: "https://cdn.i-scmp.com/sites/default/files/styles/1200x800/public/d8/images/canvas/2021/12/02/25e2a489-5a74-42db-b131-2bffdf48b208_9cf947d5.jpg?itok=DUyX1w6u&v=1638433496",
      ownerName: "Commenter 4",
      createdAt: "2023-07-29 16:00:00",
      commentText: "Commenting on this post!",
    },
  },
  {
    data: {
      commentId: "5",
      ownerId: "user5",
      ownerAvatar: "https://example.com/avatar5.jpg",
      ownerName: "Commenter 5",
      createdAt: "2023-07-29 18:20:00",
      commentText: "Fifth comment here.",
    },
  },
  {
    data: {
      commentId: "6",
      ownerId: "user6",
      ownerAvatar: "https://example.com/avatar6.jpg",
      ownerName: "Commenter 6",
      createdAt: "2023-07-29 20:45:00",
      commentText: "Commenting on this post!",
    },
  },
  {
    data: {
      commentId: "7",
      ownerId: "user7",
      ownerAvatar: "https://example.com/avatar7.jpg",
      ownerName: "Commenter 7",
      createdAt: "2023-07-29 23:10:00",
      commentText: "Seventh comment here.",
    },
  },
  {
    data: {
      commentId: "8",
      ownerId: "user8",
      ownerAvatar: "https://example.com/avatar8.jpg",
      ownerName: "Commenter 8",
      createdAt: "2023-07-30 09:30:00",
      commentText: "Eighth comment here.",
    },
  },
  {
    data: {
      commentId: "9",
      ownerId: "user9",
      ownerAvatar: "https://example.com/avatar9.jpg",
      ownerName: "Commenter 9",
      createdAt: "2023-07-30 12:00:00",
      commentText: "Ninth comment on Post 2!",
    },
  },
  {
    data: {
      commentId: "10",
      ownerId: "user10",
      ownerAvatar: "https://example.com/avatar10.jpg",
      ownerName: "Commenter 10",
      createdAt: "2023-07-30 15:20:00",
      commentText: "Tenth comment here.",
    },
  },
  {
    data: {
      commentId: "11",
      ownerId: "user11",
      ownerAvatar: "https://example.com/avatar11.jpg",
      ownerName: "Commenter 11",
      createdAt: "2023-07-30 18:45:00",
      commentText: "Commenting on this post!",
    },
  },
  {
    data: {
      commentId: "12",
      ownerId: "user12",
      ownerAvatar: "https://example.com/avatar12.jpg",
      ownerName: "Commenter 12",
      createdAt: "2023-07-30 21:00:00",
      commentText: "Twelfth comment here.",
    },
  },
  {
    data: {
      commentId: "13",
      ownerId: "user13",
      ownerAvatar: "https://example.com/avatar13.jpg",
      ownerName: "Commenter 13",
      createdAt: "2023-07-31 08:30:00",
      commentText: "Thirteenth comment here.",
    },
  },
  {
    data: {
      commentId: "14",
      ownerId: "user14",
      ownerAvatar: "https://example.com/avatar14.jpg",
      ownerName: "Commenter 14",
      createdAt: "2023-07-31 10:00:00",
      commentText: "Fourteenth comment on Post 3!",
    },
  },
  {
    data: {
      commentId: "15",
      ownerId: "user15",
      ownerAvatar: "https://example.com/avatar15.jpg",
      ownerName: "Commenter 15",
      createdAt: "2023-07-31 12:15:00",
      commentText: "Fifteenth comment here.",
    },
  },
  {
    data: {
      commentId: "16",
      ownerId: "user16",
      ownerAvatar: "https://example.com/avatar16.jpg",
      ownerName: "Commenter 16",
      createdAt: "2023-07-31 15:30:00",
      commentText: "Commenting on this post!",
    },
  },
  {
    data: {
      commentId: "17",
      ownerId: "user17",
      ownerAvatar: "https://example.com/avatar17.jpg",
      ownerName: "Commenter 17",
      createdAt: "2023-07-31 17:45:00",
      commentText: "Seventeenth comment here.",
    },
  },
  {
    data: {
      commentId: "18",
      ownerId: "user18",
      ownerAvatar: "https://example.com/avatar18.jpg",
      ownerName: "Commenter 18",
      createdAt: "2023-07-31 20:00:00",
      commentText: "Eighteenth comment on Post 4!",
    },
  },
  {
    data: {
      commentId: "19",
      ownerId: "user19",
      ownerAvatar: "https://example.com/avatar19.jpg",
      ownerName: "Commenter 19",
      createdAt: "2023-07-31 22:15:00",
      commentText: "Nineteenth comment here.",
    },
  },
  {
    data: {
      commentId: "20",
      ownerId: "user20",
      ownerAvatar: "https://example.com/avatar20.jpg",
      ownerName: "Commenter 20",
      createdAt: "2023-08-01 09:30:00",
      commentText: "Twentieth comment on Post 5!",
    },
  },
];

