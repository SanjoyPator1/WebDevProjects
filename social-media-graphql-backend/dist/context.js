import { Role } from "./typescript-models";
const context = async () => {
    return {
        token: "fake-token",
        user: {
            id: '1',
            name: 'User 1',
            email: 'user1@example.com',
            avatar: 'avatar1.jpg',
            createdAt: new Date().toISOString(),
            role: Role.ADMIN,
            friends: ['2', '3'],
        }
    };
};
export default context;
