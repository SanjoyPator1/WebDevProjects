import { Schema, model } from "mongoose";
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    createdAt: {
        type: String,
        required: true,
    },
    bio: {
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN", "MEMBER", "GUEST"],
    },
}, {
    timestamps: true,
});
const UserModel = model("User", userSchema);
export default UserModel;
