// fakeUser.ts
import { Role } from "../typescript-models";
// Define some fake user data
export const fakeUsers = [
    {
        id: '1',
        name: 'User 1',
        email: 'user1@example.com',
        avatar: 'avatar1.jpg',
        createdAt: new Date().toISOString(),
        role: Role.ADMIN,
        friends: ['2', '3'],
    },
    {
        id: '2',
        name: 'User 2',
        email: 'user2@example.com',
        avatar: 'avatar2.jpg',
        createdAt: new Date().toISOString(),
        role: Role.MEMBER,
        friends: ['1', '3'],
    },
    {
        id: '3',
        name: 'User 3',
        email: 'user3@example.com',
        avatar: 'avatar3.jpg',
        createdAt: new Date().toISOString(),
        role: Role.GUEST,
        friends: ['1', '2'],
    },
];
// Define some fake post data
export const fakePosts = [
    {
        id: '1',
        message: 'First post by user 1',
        author: '1',
        createdAt: new Date().toISOString(),
        likes: 10,
        comments: 5,
    },
    {
        id: '2',
        message: 'Second post by user 1',
        author: '1',
        createdAt: new Date().toISOString(),
        likes: 20,
        comments: 15,
    },
    {
        id: '3',
        message: 'Third post by user 2',
        author: '2',
        createdAt: new Date().toISOString(),
        likes: 8,
        comments: 3,
    },
    {
        id: '4',
        message: 'Fourth post by user 2',
        author: '2',
        createdAt: new Date().toISOString(),
        likes: 12,
        comments: 7,
    },
    {
        id: '5',
        message: 'Fifth post by user 3',
        author: '3',
        createdAt: new Date().toISOString(),
        likes: 5,
        comments: 2,
    },
];
