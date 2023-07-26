// model.ts
export enum Theme {
  DARK = "DARK",
  LIGHT = "LIGHT",
}

export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}

export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
  createdAt: string;
  posts: Post[];
  role: Role;
  settings: Settings;
}

export interface AuthUser {
  token: string;
  user: User;
}

export interface Post {
  id: string;
  message: string;
  author: User;
  createdAt: string;
  likes: number;
  views: number;
}

export interface Settings {
  id: string;
  user: User;
  theme: Theme;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface Invite {
  email: string;
  from: User;
  createdAt: string;
  role: Role;
}

export interface NewPostInput {
  message: string;
}

export interface UpdateSettingsInput {
  theme?: Theme;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

export interface UpdateUserInput {
  email?: string;
  avatar?: string;
  verified?: boolean;
}

export interface InviteInput {
  email: string;
  role: Role;
}

export interface SignupInput {
  email: string;
  password: string;
  role: Role;
}

export interface SigninInput {
  email: string;
  password: string;
}
