// src/types/post.ts
export interface User {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
}

export type CreatePost = {
    id: string;
    author: {
        name: string;
        username: string;
        avatar: string;
        verified: boolean;
    };
    content: string;
    image?: string;
    location?: string | null;
    createdAt: string;
    likes: number;
    comments: number;
    shares: number;
};